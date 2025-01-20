using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.ProspectVoucher;
using backend.Interfaces;
using backend.Models;
using Hangfire;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/prospectVoucher")]
    [ApiController]
    public class ProspectVoucherController : ControllerBase
    {
        readonly private IProspectRepository _prospectRepo;
        readonly private IProspectVoucherRepository _prospectVoucherRepo;
        readonly private UserManager<AppUser> _userManager;
        readonly private ISmtpService _smtpService;
        public ProspectVoucherController(IProspectRepository prospectRepo, IProspectVoucherRepository prospectVoucherRepo, UserManager<AppUser> userManager, ISmtpService smtpService)
        {
            _prospectRepo = prospectRepo;
            _prospectVoucherRepo = prospectVoucherRepo;
            _userManager = userManager;
            _smtpService = smtpService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateProspectVoucher(CreateProspectVoucherDto createProspectVoucherDto)
        {   
            var newProspectVoucherList = new ProspectVoucherList {
                ProspectListId = createProspectVoucherDto.ProspectListId,
                Subject = createProspectVoucherDto.Subject,
                BodyText = createProspectVoucherDto.BodyText,
                VoucherValue = createProspectVoucherDto.VoucherValue,
                EmailsCount = 0,
                ClickedCount = 0,
                ClaimedCount = 0,
                DateCreated = DateTime.Now
            };

            var prospectVoucherList = await _prospectVoucherRepo.AddProspectVoucherListAsync(newProspectVoucherList);

            var jobId = BackgroundJob.Enqueue(() => ProcessSendProspectEmail(createProspectVoucherDto, prospectVoucherList.Id));
            // BackgroundJob.ContinueWith(jobId, () => NotifyClientWhenAllJobsComplete(importEstateDto.UserId, import.Id));

            return Ok(prospectVoucherList);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllProspectVouchersAsync()
        {
            var vouchers = await _prospectVoucherRepo.GetAllProspectVoucherAsync();

            return Ok(vouchers);
        }

        [NonAction]
        public string GenerateVoucherNumber()
        {
            Random random = new Random();

            string GetRandomLetters(int length)
            {
                const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                return new string(Enumerable.Range(0, length)
                                            .Select(_ => chars[random.Next(chars.Length)])
                                            .ToArray());
            }

            return $"{GetRandomLetters(4)}-{GetRandomLetters(4)}-{GetRandomLetters(8)}-{GetRandomLetters(8)}";
        }

        [NonAction]
        public async Task ProcessSendProspectEmail(CreateProspectVoucherDto createProspectVoucherDto, Guid prospectVoucherListId)
        {
            var emailsCount = 0;
            var prospects = await _prospectRepo.GetProspectsByListIdAsync(createProspectVoucherDto.ProspectListId);

            foreach (var prospect in prospects)
            {
                var newProspectVoucher = new ProspectVoucher {
                    ProspectVoucherListId = prospectVoucherListId,
                    VoucherNumber = GenerateVoucherNumber(),
                    VoucherValue = createProspectVoucherDto.VoucherValue,
                    Email = prospect.Email,
                    ProspectId = prospect.Id,
                    GeneratedDate = DateTime.Now,
                    ClickedDate = null,
                    ClaimedDate = null,
                    ExpirationDate = DateTime.Now.AddHours(24)
                };

                var existEmail= await _userManager.Users.FirstOrDefaultAsync(x => x.Email == prospect.Email);

                if (existEmail == null)
                {
                    var emailSent = await _smtpService.SendNewCampaignEmailBySmtp(prospect.Email, createProspectVoucherDto.Subject, createProspectVoucherDto.BodyText, createProspectVoucherDto.VoucherValue, newProspectVoucher.VoucherNumber);
                    if(emailSent)
                    {
                        emailsCount++;
                        await _prospectVoucherRepo.AddProspectVoucherAsync(newProspectVoucher);
                    }
                } else
                {
                    var newEmailExistNote = new ProspectNote {
                        FK_Prospect_ID = prospect.Id,
                        Note = "Prospect already has an account",
                        CreatedBy = "",
                        DateCreated = DateTime.Now
                    };

                    await _prospectRepo.AddProspectNoteAsync(newEmailExistNote);
                    await _prospectRepo.UpdateProspectStatusAsync(prospect.Id, 0);
                }
            }

            await _prospectVoucherRepo.UpdateEmailsCountAsync(prospectVoucherListId, emailsCount);
        }
    }
}
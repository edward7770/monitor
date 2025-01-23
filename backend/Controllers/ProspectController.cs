using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Prospect;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Kiota.Abstractions;

namespace backend.Controllers
{
    [Route("api/prospect")]
    [ApiController]
    public class ProspectController : ControllerBase
    {
        readonly private UserManager<AppUser> _userManager;
        readonly private IProspectRepository _prospectRepo;
        public ProspectController(IProspectRepository prospectRepo, UserManager<AppUser> userManager)
        {
            _prospectRepo = prospectRepo;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProspectsList()
        {
            var prospectList = await _prospectRepo.GetProspectsListAsync();
            
            if (prospectList == null)
            {
                return StatusCode(403, "Failed to fetch prospect list.");
            }

            return Ok(prospectList);
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateProspects(CreateProspectsDto createProspectsDto)
        {
            var newProspectList = new ProspectList {
                Name = createProspectsDto.FileName
            };

            var prospectList = await _prospectRepo.AddProspectListAsync(newProspectList);

            if(prospectList == null)
            {
                return StatusCode(403, "Failed to add prospect list.");
            }

            foreach (var item in createProspectsDto.Prospects)
            {
                var newProspect = new Prospect {
                    Fk_ProspectList_ID = prospectList.Id,
                    Name = item.Name,
                    ContactName = item.ContactName,
                    OfficeNumber = item.OfficeNumber,
                    MobileNumber = item.MobileNumber,
                    Email = item.Email,
                    Status = 1,
                    StatusDate = DateTime.Now,
                    DateCreated = DateTime.Now
                };

                var existEmail= await _userManager.Users.FirstOrDefaultAsync(x => x.Email == item.Email);

                if (existEmail != null)
                {
                    newProspect.Status = 0;
                }

                await _prospectRepo.AddProspectAsync(newProspect);

                if(existEmail != null)
                {
                    var newEmailExistNote = new ProspectNote {
                        FK_Prospect_ID = newProspect.Id,
                        Note = "Prospect already has an account",
                        CreatedBy = "",
                        DateCreated = DateTime.Now
                    };

                    await _prospectRepo.AddProspectNoteAsync(newEmailExistNote);
                }
            }

            return Ok(createProspectsDto);
        }

        [HttpPost("note")]
        public async Task<IActionResult> CreateProspectNote(CreateProspectNoteDto createProspectNoteDto)
        {
            var newProspectNote = new ProspectNote {
                FK_Prospect_ID = createProspectNoteDto.ProspectId,
                DateCreated = DateTime.Now,
                Note = createProspectNoteDto.Note,
                CreatedBy = createProspectNoteDto.CreatedBy
            };

            var prospectNote = await _prospectRepo.AddProspectNoteAsync(newProspectNote);

            if(prospectNote == null)
            {
                return StatusCode(403, "Failed to add prospect note.");
            }

            return Ok(prospectNote);
        }
    }
}
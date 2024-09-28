using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using backend.Dtos.MatchData;
using backend.Dtos.MatchResult;
using backend.Interfaces;
using backend.Models;
using backend.Repository;
using Hangfire;
using Hangfire.Common;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Microsoft.AspNetCore.Mvc.Route("api/matchdata")]
    [ApiController]
    public class MatchDataController : ControllerBase
    {
        private readonly IMatchDataRepository _matchDataRepo;
        private readonly IFormDataRepository _formDataRepo;
        private readonly IMatchResultRepository _matchResultRepo;
        private readonly IMatchRepository _matchRepo;
        private readonly UserManager<AppUser> _userManager;
        private readonly ISmtpService _smtpService;
        public MatchDataController(IMatchDataRepository matchDataRepo, IFormDataRepository formDataRepo, IMatchResultRepository matchResultRepo, IMatchRepository matchRepo, UserManager<AppUser> userManager, ISmtpService smtpService)
        {
            _matchDataRepo = matchDataRepo;
            _formDataRepo = formDataRepo;
            _matchResultRepo = matchResultRepo;
            _matchRepo = matchRepo;
            _userManager = userManager;
            _smtpService = smtpService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> createMatchData(List<CreateMatchDataRequestDto> matchDataRequestDtos)
        {
            var matchDatas = await _matchDataRepo.AddAsync(matchDataRequestDtos);

            if (matchDatas == null)
            {
                return StatusCode(403, "Failed to store match datas");
            }

            var clientJobs = new ConcurrentDictionary<int, List<string>>();
            foreach (var match in matchDataRequestDtos)
            {
                var jobId = BackgroundJob.Enqueue(() => ProcessMatchDataAsync(match.MatchId, match.IdNumber));
                clientJobs.AddOrUpdate(match.MatchId, new List<string> { jobId }, (key, list) => { list.Add(jobId); return list; });
            }

            foreach (var clientId in clientJobs.Keys)
            {
                var jobIds = clientJobs[clientId];
                BackgroundJob.ContinueWith(jobIds.Last(), () => NotifyClientWhenAllJobsComplete(matchDataRequestDtos[0].MatchId));
            }

            // foreach (var matchData in matchDataRequestDtos)
            // {
            //     BackgroundJob.Enqueue(() => ProcessMatchDataAsync(matchData.MatchId, matchData.IdNumber));
            // }

            return Ok(matchDatas);
        }

        // Background processing method
        [NonAction]
        public async Task ProcessMatchDataAsync(int matchId, string idNumber)
        {
            var filteredRecords = await _formDataRepo.FilterByIdNumberAsync(matchId, idNumber);

            await _matchResultRepo.AddAsync(filteredRecords);
        }

        [NonAction]
        public async Task NotifyClientWhenAllJobsComplete(int matchId)
        {
            var matchData = await _matchRepo.GetByMatchIdAsync(matchId);

            await _matchRepo.UpdateMatchAsync(matchId);

            if (matchData != null)
            {
                var user = await _userManager.FindByIdAsync(matchData.ClientId);

                if (user != null)
                {
                    await _smtpService.SendProcessResultMailbySmtp(user.Email, user.Name);
                }
            }
        }

        [NonAction]
        public static string ExtractFirst13DigitNumber(string input)
        {
            Regex regex = new Regex(@"\b\d{13}\b");

            var match = regex.Match(input);

            return match.Success ? match.Value : null;
        }

        [HttpGet("monitor")]
        public async Task<IActionResult> MonitorActionAsync([FromQuery] string userId = "")
        {
            BackgroundJob.Enqueue(() => ProcessMonitorActionAsync(userId));
            return Ok("Monitor Action run successfully!");
        }

        [NonAction]
        public async Task ProcessMonitorActionAsync(string userId)
        {
            var matchFormRecords = new List<MatchResult>();
            var latestJ187Records = await _formDataRepo.GetLatestForm187Async();
            var latestJ193Records = await _formDataRepo.GetLatestForm193Async();

            foreach (var form187Record in latestJ187Records)
            {
                var idNumber = ExtractFirst13DigitNumber(form187Record.RawRecord);

                if (idNumber != null)
                {
                    var matchDataRecords = await _matchDataRepo.GetLatestMatchDatasByIdNumber(idNumber);

                    if(matchDataRecords.Count > 0)
                    {
                        foreach (var matchDataRecord in matchDataRecords)
                        {
                            var lastMatchedStepDto = await _matchResultRepo.GetLastMatchedStepAsync(matchDataRecord.MatchId);

                            var matchForm187 = new MatchResult
                            {
                                MatchId = matchDataRecord.MatchId,
                                IdNumber = idNumber,
                                Type = "J187",
                                RecordId = form187Record.RecordId,
                                RawRecord = form187Record.RawRecord,
                                MatchedStep = lastMatchedStepDto.MatchedStep + 1,
                                DateMatched = DateTime.Now
                            };

                            matchFormRecords.Add(matchForm187);
                        }
                    }
                }
            }

            foreach (var form193Record in latestJ193Records)
            {
                var idNumber = ExtractFirst13DigitNumber(form193Record.RawRecord);

                if (idNumber != null)
                {
                    var matchDataRecords = await _matchDataRepo.GetLatestMatchDatasByIdNumber(idNumber);

                    if(matchDataRecords.Count > 0)
                    {
                        foreach (var matchDataRecord in matchDataRecords)
                        {
                            var lastMatchedStepDto = await _matchResultRepo.GetLastMatchedStepAsync(matchDataRecord.MatchId);

                            var matchForm193 = new MatchResult
                            {
                                MatchId = matchDataRecord.MatchId,
                                IdNumber = idNumber,
                                Type = "J193",
                                RecordId = form193Record.RecordId,
                                RawRecord = form193Record.RawRecord,
                                MatchedStep = lastMatchedStepDto.MatchedStep + 1,
                                DateMatched = DateTime.Now
                            };

                            matchFormRecords.Add(matchForm193);
                        }
                    }
                }
            }

            await _matchResultRepo.AddAsync(matchFormRecords);


            var user = await _userManager.FindByIdAsync(userId);

            if (user != null)
            {
                await _smtpService.SendMonitorActionMailbySmtp(user.Email, user.Name);
            }
        }

        [HttpPost("update")]
        public async Task<IActionResult> updateDownloadDates(List<UpdateDownloadDateDto> matchResultRequestDtos)
        {
            foreach (var item in matchResultRequestDtos)
            {
                await _matchResultRepo.UpdateAsync(item.Id);
            }

            return Ok(matchResultRequestDtos);
        }

        // [HttpGet("count")]
        // public async Task<IActionResult> GetMatchResultsCount(string clientId)
        // {
        //     var matchResultsCount = await _matchResultRepo.GetMatchedResultsCountByClient(clientId, DateTime.Now.AddMonths(-1) ,DateTime.Now);

        //     return Ok(matchResultsCount);
        // }
    }
}
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.IO;
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
using Microsoft.AspNetCore.StaticFiles;
using OfficeOpenXml;

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
        private readonly IWebHostEnvironment _hostEnvironment;
        public MatchDataController(IMatchDataRepository matchDataRepo, IFormDataRepository formDataRepo, IMatchResultRepository matchResultRepo, IMatchRepository matchRepo, UserManager<AppUser> userManager, ISmtpService smtpService, IWebHostEnvironment hostEnvironment)
        {
            _matchDataRepo = matchDataRepo;
            _formDataRepo = formDataRepo;
            _matchResultRepo = matchResultRepo;
            _matchRepo = matchRepo;
            _userManager = userManager;
            _smtpService = smtpService;
            _hostEnvironment = hostEnvironment;
        }

        [HttpPost("create")]
        [Obsolete]
        public async Task<IActionResult> createMatchData(List<CreateMatchDataRequestDto> matchDataRequestDtos)
        {
            var matchDatas = await _matchDataRepo.AddAsync(matchDataRequestDtos);

            if (matchDatas == null)
            {
                return StatusCode(403, "Failed to store match datas");
            }

            // var clientJobs = new ConcurrentDictionary<int, List<string>>();
            // foreach (var match in matchDataRequestDtos)
            // {
            //     var jobId = BackgroundJob.Enqueue(() => ProcessMatchDataAsync(match.MatchId, match.IdNumber));
            //     clientJobs.AddOrUpdate(match.MatchId, new List<string> { jobId }, (key, list) => { list.Add(jobId); return list; });
            // }

            // foreach (var clientId in clientJobs.Keys)
            // {
            //     var jobIds = clientJobs[clientId];
            //     BackgroundJob.ContinueWith(jobIds.Last(), () => NotifyClientWhenAllJobsComplete(matchDataRequestDtos[0].MatchId));
            // }

            if(matchDataRequestDtos.Count == 0 || matchDataRequestDtos == null)
            {
                return StatusCode(403, "There is no matched records");
            }

            var jobId = BackgroundJob.Enqueue(() => ProcessMatchDataAsync(matchDataRequestDtos[0].MatchId));
            BackgroundJob.ContinueWith(jobId, () => NotifyClientWhenAllJobsComplete(matchDataRequestDtos[0].MatchId));

            // foreach (var matchData in matchDataRequestDtos)
            // {
            //     BackgroundJob.Enqueue(() => ProcessMatchDataAsync(matchData.MatchId, matchData.IdNumber));
            // }

            return Ok(matchDatas);
        }

        // Background processing method
        [NonAction]
        public async Task ProcessMatchDataAsync(int matchId)
        {
            // int index = 1;

            var filteredRecords = await _formDataRepo.FilterByIdNumberAsync(matchId);

            await _matchResultRepo.AddAsync(matchId, filteredRecords);

            await _matchRepo.UpdateMatchAsync(matchId);
        }

        [NonAction]
        public async Task NotifyClientWhenAllJobsComplete(int matchId)
        {
            var matchData = await _matchRepo.GetByMatchIdAsync(matchId);

            if (matchData == null)
            {
                return; // Exit if matchData is null
            }

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
            var jobId = BackgroundJob.Enqueue(() => ProcessMonitorActionAsync(userId));
            BackgroundJob.ContinueWith(jobId, () => NotifyClientWhenMonitorActionComplete(userId));

            return Ok("Monitor Action run successfully!");
        }

        // [NonAction]
        // public async Task ProcessRecordsAsync<TRecord>(
        //     List<TRecord> formRecords,
        //     Dictionary<int, List<TRecord>> matchedRecordsDictionary,
        //     string recordType) where TRecord : class
        // {
        //     foreach (var formRecord in formRecords)
        //     {
        //         var idNumber = formRecord.IdNo;
        //         if (idNumber == null) continue;

        //         var matchDataRecords = await _matchDataRepo.GetLatestMatchDatasByIdNumber(idNumber);
        //         if (matchDataRecords.Count == 0) continue;

        //         foreach (var matchDataRecord in matchDataRecords)
        //         {
        //             var lastMatchedStepDto = await _matchResultRepo.GetLastMatchedStepAsync(matchDataRecord.MatchId);
        //             var matchResult = CreateMatchResult(matchDataRecord, idNumber, recordType, formRecord, lastMatchedStepDto.MatchedStep + 1);

        //             if (!matchedRecordsDictionary.ContainsKey(matchDataRecord.MatchId))
        //             {
        //                 matchedRecordsDictionary[matchDataRecord.MatchId] = new List<TRecord>();
        //             }
        //             matchedRecordsDictionary[matchDataRecord.MatchId].Add(formRecord);
        //             matchFormRecords.Add(matchResult);
        //         }
        //     }
        // }

        [NonAction]
        public async Task ProcessJ187RecordsAsync(
            IEnumerable<XJ187> latestJ187Records,
            Dictionary<int, List<XJ187>> matched187RecordsDictionary,
            List<MatchResult> matchFormRecords)
        {
            foreach (var form187Record in latestJ187Records)
            {
                if (form187Record.IdNo == null) continue;

                var matchDataRecords = await _matchDataRepo.GetLatestMatchDatasByIdNumber(form187Record.IdNo);

                if (matchDataRecords.Count > 0)
                {
                    foreach (var matchDataRecord in matchDataRecords)
                    {
                        var lastMatchedStepDto = await _matchResultRepo.GetLastMatchedStepAsync(matchDataRecord.MatchId);

                        var matchForm187 = new MatchResult
                        {
                            MatchId = matchDataRecord.MatchId,
                            IdNumber = form187Record.IdNo,
                            Type = "J187",
                            RecordId = form187Record.Fk_RecordId,
                            RawRecord = form187Record.RawRecord,
                            MatchedStep = lastMatchedStepDto.MatchedStep + 1,
                            DateMatched = DateTime.Now
                        };

                        if (!matched187RecordsDictionary.ContainsKey(matchDataRecord.MatchId))
                            matched187RecordsDictionary[matchDataRecord.MatchId] = new List<XJ187>();

                        matched187RecordsDictionary[matchDataRecord.MatchId].Add(form187Record);
                        matchFormRecords.Add(matchForm187);
                    }
                }
            }
        }

        [NonAction]
        public async Task ProcessJ193RecordsAsync(
            IEnumerable<XJ193> latestJ193Records,
            Dictionary<int, List<XJ193>> matched193RecordsDictionary,
            List<MatchResult> matchFormRecords)
        {
            foreach (var form193Record in latestJ193Records)
            {
                var idNumber = form193Record.IdNo;
                if (idNumber == null) continue;

                var matchDataRecords = await _matchDataRepo.GetLatestMatchDatasByIdNumber(idNumber);

                if (matchDataRecords.Count > 0)
                {
                    foreach (var matchDataRecord in matchDataRecords)
                    {
                        var lastMatchedStepDto = await _matchResultRepo.GetLastMatchedStepAsync(matchDataRecord.MatchId);

                        var matchForm193 = new MatchResult
                        {
                            MatchId = matchDataRecord.MatchId,
                            IdNumber = idNumber,
                            Type = "J193",
                            RecordId = form193Record.Fk_RecordId,
                            RawRecord = form193Record.RawRecord,
                            MatchedStep = lastMatchedStepDto.MatchedStep + 1,
                            DateMatched = DateTime.Now
                        };

                        if (!matched193RecordsDictionary.ContainsKey(matchDataRecord.MatchId))
                            matched193RecordsDictionary[matchDataRecord.MatchId] = new List<XJ193>();

                        matched193RecordsDictionary[matchDataRecord.MatchId].Add(form193Record);
                        matchFormRecords.Add(matchForm193);
                    }
                }
            }
        }

        [NonAction]
        public async Task<string> GenerateExcelFileAsync(
            Models.Match match,
            Dictionary<int, List<XJ187>> matched187RecordsDictionary,
            Dictionary<int, List<XJ193>> matched193RecordsDictionary)
        {
            var matchedFolderPath = Path.Combine(_hostEnvironment.ContentRootPath, "Uploads", "MatchedFiles");
            var matchedFileName = $"{Guid.NewGuid()}.xlsx";
            var filePath = Path.Combine(matchedFolderPath, matchedFileName);

            using (var package = new ExcelPackage())
            {
                // Add J187 sheet if records are available
                if (matched187RecordsDictionary.ContainsKey(match.Id))
                {
                    var worksheetJ187 = package.Workbook.Worksheets.Add("J187");
                    AddJ187RecordsToSheet(worksheetJ187, matched187RecordsDictionary[match.Id]);
                }

                // Add J193 sheet if records are available
                if (matched193RecordsDictionary.ContainsKey(match.Id))
                {
                    var worksheetJ193 = package.Workbook.Worksheets.Add("J193");
                    AddJ193RecordsToSheet(worksheetJ193, matched193RecordsDictionary[match.Id]);
                }

                // Save the Excel file
                await SaveExcelPackageAsync(package, filePath);
            }

            return filePath;
        }

        [NonAction]
        public void AddJ187RecordsToSheet(ExcelWorksheet worksheet, List<XJ187> records)
        {
            worksheet.Cells[1, 1].Value = "IdNo";
            worksheet.Cells[1, 2].Value = "CaseNumber";
            worksheet.Cells[1, 3].Value = "Name";
            worksheet.Cells[1, 4].Value = "Particulars";
            worksheet.Cells[1, 5].Value = "NoticeDate";
            worksheet.Cells[1, 6].Value = "AccountDescription";
            worksheet.Cells[1, 7].Value = "SurvivingSpouse";
            worksheet.Cells[1, 8].Value = "InspectionPeriod";
            worksheet.Cells[1, 9].Value = "ExecutorName";
            worksheet.Cells[1, 10].Value = "ExecutorPhoneNumber";
            worksheet.Cells[1, 11].Value = "ExecutorEmail";
            worksheet.Cells[1, 12].Value = "RawRecord";

            for (int i = 0; i < records.Count; i++)
            {
                var record = records[i];
                worksheet.Cells[i + 2, 1].Value = record.IdNo;
                worksheet.Cells[i + 2, 2].Value = record.CaseNumber;
                worksheet.Cells[i + 2, 3].Value = record.Name;
                worksheet.Cells[i + 2, 4].Value = record.Particulars;
                worksheet.Cells[i + 2, 5].Value = record.NoticeDate;
                worksheet.Cells[i + 2, 6].Value = record.AccountDescription;
                worksheet.Cells[i + 2, 7].Value = record.SurvivingSpouse;
                worksheet.Cells[i + 2, 8].Value = record.InspectionPeriod;
                worksheet.Cells[i + 2, 9].Value = record.ExecutorName;
                worksheet.Cells[i + 2, 10].Value = record.ExecutorPhoneNumber;
                worksheet.Cells[i + 2, 11].Value = record.ExecutorEmail;
                worksheet.Cells[i + 2, 12].Value = record.RawRecord;
            }
        }

        [NonAction]
        public void AddJ193RecordsToSheet(ExcelWorksheet worksheet, List<XJ193> records)
        {
            worksheet.Cells[1, 1].Value = "IdNo";
            worksheet.Cells[1, 2].Value = "CaseNumber";
            worksheet.Cells[1, 3].Value = "Name";
            worksheet.Cells[1, 4].Value = "Particulars";
            worksheet.Cells[1, 5].Value = "NoticeDate";
            worksheet.Cells[1, 6].Value = "RawRecord";

            for (int i = 0; i < records.Count; i++)
            {
                var record = records[i];
                worksheet.Cells[i + 2, 1].Value = record.IdNo;
                worksheet.Cells[i + 2, 2].Value = record.CaseNumber;
                worksheet.Cells[i + 2, 3].Value = record.Name;
                worksheet.Cells[i + 2, 4].Value = record.Particulars;
                worksheet.Cells[i + 2, 5].Value = record.NoticeDate;
                worksheet.Cells[i + 2, 6].Value = record.RawRecord;
            }
        }

        [NonAction]
        public async Task NotifyClientWhenMonitorActionComplete(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user != null)
            {
                // await _smtpService.SendMonitorActionMailbySmtp(user.Email, user.Name);
                await _smtpService.SendMonitorActionMailbySmtp("edwardthomas7770@gmail.com", user.Name);
            }
        }

        [NonAction]
        public async Task ProcessMonitorActionAsync(string userId)
        {
            var matchFormRecords = new List<MatchResult>();
            var latestJ187Records = await _formDataRepo.GetLatestForm187Async();
            var latestJ193Records = await _formDataRepo.GetLatestForm193Async();

            var matched187RecordsDictionary = new Dictionary<int, List<XJ187>>();
            var matched193RecordsDictionary = new Dictionary<int, List<XJ193>>();

            if(latestJ187Records != null || latestJ193Records != null)
            {
                // foreach (var form187Record in latestJ187Records)
                // {
                //     var idNumber = form187Record.IdNo;

                //     if (idNumber != null)
                //     {
                //         var matchDataRecords = await _matchDataRepo.GetLatestMatchDatasByIdNumber(idNumber);

                //         if(matchDataRecords.Count > 0)
                //         {
                //             foreach (var matchDataRecord in matchDataRecords)
                //             {
                //                 var lastMatchedStepDto = await _matchResultRepo.GetLastMatchedStepAsync(matchDataRecord.MatchId);

                //                 var matchForm187 = new MatchResult
                //                 {
                //                     MatchId = matchDataRecord.MatchId,
                //                     IdNumber = idNumber,
                //                     Type = "J187",
                //                     RecordId = form187Record.Fk_RecordId,
                //                     RawRecord = form187Record.RawRecord,
                //                     MatchedStep = lastMatchedStepDto.MatchedStep + 1,
                //                     DateMatched = DateTime.Now
                //                 };

                //                 if (!matched187RecordsDictionary.ContainsKey(matchDataRecord.MatchId))
                //                 {
                //                     matched187RecordsDictionary[matchDataRecord.MatchId] = new List<XJ187>();
                //                 }

                //                 matched187RecordsDictionary[matchDataRecord.MatchId].Add(form187Record);

                //                 matchFormRecords.Add(matchForm187);
                //             }
                //         }
                //     }
                // }

                // foreach (var form193Record in latestJ193Records)
                // {
                //     var idNumber = ExtractFirst13DigitNumber(form193Record.RawRecord);

                //     if (idNumber != null)
                //     {
                //         var matchDataRecords = await _matchDataRepo.GetLatestMatchDatasByIdNumber(idNumber);

                //         if(matchDataRecords.Count > 0)
                //         {
                //             foreach (var matchDataRecord in matchDataRecords)
                //             {
                //                 var lastMatchedStepDto = await _matchResultRepo.GetLastMatchedStepAsync(matchDataRecord.MatchId);

                //                 var matchForm193 = new MatchResult
                //                 {
                //                     MatchId = matchDataRecord.MatchId,
                //                     IdNumber = idNumber,
                //                     Type = "J193",
                //                     RecordId = form193Record.Fk_RecordId,
                //                     RawRecord = form193Record.RawRecord,
                //                     MatchedStep = lastMatchedStepDto.MatchedStep + 1,
                //                     DateMatched = DateTime.Now
                //                 };

                //                 if (!matched193RecordsDictionary.ContainsKey(matchDataRecord.MatchId))
                //                 {
                //                     matched193RecordsDictionary[matchDataRecord.MatchId] = new List<XJ193>();
                //                 }

                //                 matched193RecordsDictionary[matchDataRecord.MatchId].Add(form193Record);

                //                 matchFormRecords.Add(matchForm193);
                //             }
                //         }
                //     }
                // }

                await ProcessJ187RecordsAsync(latestJ187Records, matched187RecordsDictionary, matchFormRecords);

                await ProcessJ193RecordsAsync(latestJ193Records, matched193RecordsDictionary, matchFormRecords);

                var allMatches = await _matchRepo.GetAllMatchesAsync();
                foreach (var match in allMatches)
                {
                    bool hasJ187Match = matched187RecordsDictionary.ContainsKey(match.Id);
                    bool hasJ193Match = matched193RecordsDictionary.ContainsKey(match.Id);

                    if (hasJ187Match || hasJ193Match)
                    {
                        var filePath = await GenerateExcelFileAsync(match, matched187RecordsDictionary, matched193RecordsDictionary);
                        await _matchRepo.UpdateResultFileNameAsync(match.Id, Path.GetFileName(filePath));
                    }
                }

                await _matchResultRepo.AddAsync(0, matchFormRecords);
            }
        }

        [NonAction]
        public async Task SaveExcelPackageAsync(ExcelPackage package, string filePath)
        {
            await Task.Run(() => package.SaveAs(new FileInfo(filePath)));
        }

        [HttpPost("update")]
        public async Task<IActionResult> updateDownloadDates(UpdateDownloadDateDto updateDownloadDateDto)
        {
            var matchResult = await _matchResultRepo.UpdateAsync(updateDownloadDateDto);

            return Ok(matchResult);
        }

        // [HttpGet("count")]
        // public async Task<IActionResult> GetMatchResultsCount(string clientId)
        // {
        //     var matchResultsCount = await _matchResultRepo.GetMatchedResultsCountByClient(clientId, DateTime.Now.AddMonths(-1) ,DateTime.Now);

        //     return Ok(matchResultsCount);
        // }

        [HttpGet("download")]
        public async Task<IActionResult> DownloadMonitorFile([FromQuery] string resultFileName, [FromQuery] int monitorNumber)
        {
            var filePath = Path.Combine(_hostEnvironment.ContentRootPath, "Uploads\\MatchedFiles", resultFileName);

            var provider = new FileExtensionContentTypeProvider();

            if(!provider.TryGetContentType(filePath, out var contentType))
            {
                contentType = "application/octet-stream";
            }

            var bytes = await System.IO.File.ReadAllBytesAsync(filePath);
            // var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);

            return File(bytes, contentType, "monitor" + monitorNumber + ".xlsx");
        }
    }
}
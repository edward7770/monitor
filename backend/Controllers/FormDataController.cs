using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.FormData;
using backend.Dtos.SearchLog;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Hangfire;
using Hangfire.Common;
using Microsoft.AspNetCore.Identity;
using System.Text.RegularExpressions;

namespace backend.Controllers
{
    [Route("api/data")]
    [ApiController]
    public class FormDataController : ControllerBase
    {
        private readonly ILogger<FormDataController> _logger;
        readonly private IFormDataRepository _formDataRepo;
        readonly private ISearchLogRepository _searchLogRepo;
        readonly private UserManager<AppUser> _userManager;
        readonly private ISmtpService _smtpService;
        readonly private IImportRepository _importRepo;
        public FormDataController(ILogger<FormDataController> logger, IFormDataRepository formDataRepo, ISearchLogRepository searchLogRepo, UserManager<AppUser> userManager, ISmtpService smtpService, IImportRepository importRepo)
        {
            _formDataRepo = formDataRepo;
            _searchLogRepo = searchLogRepo;
            _userManager = userManager;
            _smtpService = smtpService;
            _importRepo = importRepo;
            _logger = logger;
        }

        [HttpGet("form187")]
        public async Task<IActionResult> GetAllForm187(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string sortColumn = "DateCreated",
            [FromQuery] string sortDirection = "asc",
            [FromQuery] string search = "")

        {
            var form187Records = await _formDataRepo.GetAllForm187Async(page, pageSize, sortColumn, sortDirection, search);

            return Ok(form187Records);
        }

        [HttpGet("form193")]
        public async Task<IActionResult> GetAllForm193(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string sortColumn = "DateCreated",
            [FromQuery] string sortDirection = "asc",
            [FromQuery] string search = "")
        {
            var form193Records = await _formDataRepo.GetAllForm193Async(page, pageSize, sortColumn, sortDirection, search);

            return Ok(form193Records);
        }

        [HttpGet("form187/{recordId}")]
        public async Task<IActionResult> GetForm187Record(Guid recordId)
        {
            var form187Record = await _formDataRepo.GetForm187ByRecordIdAsync(recordId);

            return Ok(form187Record);
        }

        [HttpGet("form193/{recordId}")]
        public async Task<IActionResult> GetForm193Record(Guid recordId)
        {
            var form193Record = await _formDataRepo.GetForm193ByRecordIdAsync(recordId);

            return Ok(form193Record);
        }

        [HttpGet("import")]
        public async Task<IActionResult> GetAllImportsAsync()
        {
            var imports = await _importRepo.GetAllImportsAsync();

            if (imports == null)
            {
                return StatusCode(403, "Failed to fetch imports data");
            }

            return Ok(imports);
        }

        [HttpPost("import193")]
        public async Task<IActionResult> RunImportEstates193Async([FromBody] ImportEstateDto importEstateDto)
        {
            var newImport = new Import
            {
                UserId = importEstateDto.UserId,
                Type = importEstateDto.Type,
                Progress = 0,
                Records = 0,
                StartDate = DateTime.Now,
                EndDate = null
            };

            var import = await _importRepo.AddImportDataAsync(newImport);

            if (import == null)
            {
                return StatusCode(403, "Failed to add import data");
            }

            var jobId = BackgroundJob.Enqueue(() => ProcessImportEstates193Async(import.Id));
            BackgroundJob.ContinueWith(jobId, () => NotifyClientWhenAllJobsComplete(importEstateDto.UserId, import.Id));

            return Ok(import);
        }

        [HttpPost("import187")]
        public async Task<IActionResult> RunImportEstates187Async([FromBody] ImportEstateDto importEstateDto)
        {
            var newImport = new Import
            {
                UserId = importEstateDto.UserId,
                Type = importEstateDto.Type,
                Progress = 0,
                Records = 0,
                StartDate = DateTime.Now,
                EndDate = null
            };

            var import = await _importRepo.AddImportDataAsync(newImport);

            if (import == null)
            {
                return StatusCode(403, "Failed to add import data");
            }

            var jobId = BackgroundJob.Enqueue(() => ProcessImportEstates187Async(import.Id));
            BackgroundJob.ContinueWith(jobId, () => NotifyClientWhenAllJobsComplete(importEstateDto.UserId, import.Id));

            return Ok(import);
        }

        [NonAction]
        public async Task ProcessImportEstates193Async(int importId)
        {
            const int batchSize = 100;

            // Fetch the form data
            var importFormData193 = await _formDataRepo.GetImportFormData193Async().ConfigureAwait(false);

            if (importFormData193 == null || !importFormData193.Any())
            {
                // No records to process, mark as complete
                await _importRepo.UpdateImportEndDateAsync(importId).ConfigureAwait(false);
                return;
            }

            var totalRecords = importFormData193.Count;

            // Update the record count in the import
            await _importRepo.UpdateImportRecordsAsync(importId, totalRecords).ConfigureAwait(false);

            int totalProcessed = 0;

            // Process records in batches
            for (int i = 0; i < totalRecords; i += batchSize)
            {
                int batchStartIndex = i;
                var batch = importFormData193.Skip(batchStartIndex).Take(batchSize).ToList();
                int batchProcessedSoFar = totalProcessed + batch.Count;

                // Enqueue batch processing
                var formattedRecords = new List<XJ193>();

                foreach (var form193 in batch)
                {
                    var formattedForm193 = await ExtractRawRecord193Async(form193).ConfigureAwait(false);
                    formattedRecords.Add(formattedForm193);
                }

                // Update import progress
                await _importRepo.UpdateImportProgressAsync(importId, batchProcessedSoFar).ConfigureAwait(false);

                // Bulk insert formatted records
                await _formDataRepo.AddBulkFormData193Async(formattedRecords).ConfigureAwait(false);

                totalProcessed += batch.Count;
            }
            
            await _importRepo.UpdateImportEndDateAsync(importId).ConfigureAwait(false);
        }

        [NonAction]
        public async Task ProcessImportEstates187Async(int importId)
        {
            const int batchSize = 100;

            var importFormData187 = await _formDataRepo.GetImportFormData187Async().ConfigureAwait(false);

            if (importFormData187 == null || !importFormData187.Any())
            {
                // No records to process, mark as complete
                await _importRepo.UpdateImportEndDateAsync(importId).ConfigureAwait(false);
                return;
            }


            var totalRecords = importFormData187.Count;

            await _importRepo.UpdateImportRecordsAsync(importId, totalRecords).ConfigureAwait(false);

            int totalProcessed = 0;

            for (int i = 0; i < totalRecords; i += batchSize)
            {
                int batchStartIndex = i;
                var batch = importFormData187.Skip(batchStartIndex).Take(batchSize).ToList();

                if (batch == null || !batch.Any())
                {
                    break;
                }

                int batchProcessedSoFar = totalProcessed + batch.Count;

                var formattedRecords = new List<XJ187>();

                foreach (var form187 in batch)
                {
                    try
                    {
                        var formattedForm187 = await ExtractRawRecord187Async(form187).ConfigureAwait(false);
                        formattedRecords.Add(formattedForm187);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, $"Failed to process form ID: {form187.RecordId}");
                        // Optionally continue processing other records or break the loop
                    }
                }

                // Update import progress
                await _importRepo.UpdateImportProgressAsync(importId, batchProcessedSoFar).ConfigureAwait(false);

                // Bulk insert formatted records
                await _formDataRepo.AddBulkFormData187Async(formattedRecords).ConfigureAwait(false);

                totalProcessed += batch.Count;
            }
            
            await _importRepo.UpdateImportEndDateAsync(importId).ConfigureAwait(false);
        }

        [NonAction]
        public async Task<XJ193> ExtractRawRecord193Async(J193FormRecord form193)
        {
            string rawRecord = form193.RawRecord.Replace("-", ""); // Remove dashes
            DateOnly noticeDate = form193.NoticeDate.HasValue
                ? DateOnly.FromDateTime(form193.NoticeDate.Value)
                : DateOnly.MinValue;

            // Initialize variables
            string caseNumber = string.Empty;
            string idNumber = string.Empty;
            string name = string.Empty;
            string particulars = string.Empty;

            // Check if rawRecord contains certain sections
            if (rawRecord.Contains("(2)") && rawRecord.Contains("(3)") && rawRecord.Contains("(4)") &&
                rawRecord.Contains("(5)") && rawRecord.Contains("(6)"))
            {
                // Split rawRecord by (2) to extract caseNumber and particulars
                caseNumber = rawRecord.Split("(2)")[0].Replace("—", "");
                particulars = rawRecord.Split("(2)")[1].Split("(3)")[0];
                idNumber = ExtractFirst13DigitNumber(rawRecord);

                // Extract idNumber and name from particulars
                string[] particularsArray = particulars.Split(", ");
                if (particularsArray.Length > 3)
                {
                    name = Regex.Replace(particularsArray[0], @"[^a-zA-Z\s]", "") + " , " + Regex.Replace(particularsArray[1], @"[^a-zA-Z\s]", "");

                    // if(idNumber == null)
                    // {
                    //     idNumber = particularsArray[3];
                    // }
                }

            }
            else
            {
                // Fallback logic if rawRecord doesn't contain all sections
                string[] rawRecordArray = rawRecord.Split(", ");
                idNumber = ExtractFirst13DigitNumber(rawRecord);
                if(rawRecordArray[0].Contains("—"))
                {
                    caseNumber = rawRecordArray[0].Split("—")[0];
                } else
                {
                    var pattern = @"^(\d{1,6}\/\d{1,4})";
                    caseNumber = rawRecordArray[0];
                    var match = Regex.Match(caseNumber, pattern);
                    if (match.Success)
                    {
                        caseNumber = match.Groups[1].Value;
                    }
                }

                if(rawRecordArray.Length >= 2)
                {
                    name = Regex.Replace(rawRecordArray[0].Split("—").Last(), @"[^a-zA-Z\s]", "")  + " , " + Regex.Replace(rawRecordArray[1], @"[^a-zA-Z\s]", "");
                }

                
                if (rawRecordArray.Length >= 8)
                {
                    // caseNumber = rawRecordArray[0];

                    if(rawRecordArray[0].Contains("(2)") && rawRecordArray[0].Contains("(3"))
                    {
                        particulars = rawRecord.Split("(2)")[1].Split("(3")[0];
                    } else
                    {
                        particulars = name + ", " + string.Join(", ", rawRecordArray.Skip(2).Take(5));
                    }

                    // if(idNumber == null)
                    // {
                    //     idNumber = rawRecordArray[3];
                    // }
                } else
                {
                    particulars = rawRecord;
                }

            }

            var itemObject = new XJ193
            {
                Fk_RecordId = form193.RecordId,
                CaseNumber = caseNumber,
                IdNo = idNumber,
                Name = name,
                Particulars = particulars,
                NoticeDate = noticeDate,
                RawRecord = rawRecord,
                DateCreated = (DateTime)form193.DateCreated,
                DateImported = DateTime.Now
            };

            return await Task.FromResult(itemObject);
        }

        [NonAction]
        public string ExtractEmail(string text)
        {
            // Email regex pattern
            const string emailPattern = @"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}";
            var match = Regex.Match(text, emailPattern, RegexOptions.IgnoreCase);

            return match.Success ? match.Value : null;
        }

        [NonAction]
        public string ExtractFirst13DigitNumber(string str)
        {
            // Pattern to match a 13-digit number
            const string numberPattern = @"\b\d{13}\b";
            var match = Regex.Match(str, numberPattern);

            return match.Success ? match.Value : null;
        }

        [NonAction]
        public async Task<XJ187> ExtractRawRecord187Async(J187FormRecord form187)
        {
            // Remove dashes from the raw record
            string rawRecord = form187.RawRecord.Replace("-", "");

            // Declare variables to hold extracted values
            string caseNumber = "", idNumber = "", name = "", particulars = "",
                description = "", spousedetails = "", period = "", executorName = "",
                executorPhone = "", executorEmail = "", advertiserDetails = "";

            DateOnly noticeDate = form187.NoticeDate.HasValue
                ? DateOnly.FromDateTime(form187.NoticeDate.Value)
                : DateOnly.MinValue;

            try
            {
                // Split the rawRecord only once to avoid multiple operations
                string[] splitBySection2 = rawRecord.Split("(2)");
                if (splitBySection2.Length > 1)
                {
                    caseNumber = splitBySection2[0].Replace("—", "").Trim(); // Extract case number
                    string afterSection2 = splitBySection2[1];

                    string[] splitBySection3 = afterSection2.Split("(3)");
                    if (splitBySection3.Length > 1)
                    {
                        particulars = splitBySection3[0].Trim(); // Extract particulars
                        var nameParts = particulars.Split(", ");
                        if (nameParts.Length >= 2)
                        {
                            name = $"{nameParts[0]} , {nameParts[1].Split(" (")[0].Replace(" ", "")}"; // Extract name
                        }
                        string afterSection3 = splitBySection3[1];

                        string[] splitBySection4 = afterSection3.Split("(4)");
                        if (splitBySection4.Length > 1)
                        {
                            description = splitBySection4[0].Replace(";", "").Trim(); // Extract description
                            string afterSection4 = splitBySection4[1];

                            string[] splitBySection5 = afterSection4.Split("(5)");
                            string[] splitBySection51 = form187.RawRecord.Split("(5)");
                            if (splitBySection5.Length > 1)
                            {
                                spousedetails = splitBySection5[0].Replace(";", "").Trim(); // Extract spouse details
                                string afterSection5 = splitBySection51[1];

                                string[] splitBySection6 = afterSection5.Split("(6)");
                                string[] splitBySection61 = form187.RawRecord.Split("(6)");
                                if (splitBySection6.Length > 1)
                                {
                                    period = splitBySection6[0].Replace(".", "").Trim(); // Extract period
                                    advertiserDetails = splitBySection61[1].Trim(); // Extract advertiser details

                                    executorName = advertiserDetails.Split("; ")[0]; // Extract executor name

                                    if (form187.RawRecord.Contains("Tel:"))
                                    {
                                        // executorPhone = Regex.Replace(form187.RawRecord.Split("Tel:")[1].Replace(".", "").Trim(), "[^0-9]", ""); // Extract phone number
                                        var match = Regex.Match(form187.RawRecord, @"Tel:\s*([\d\s]+)");
                                        if (match.Success)
                                        {
                                            executorPhone = match.Groups[1].Value;
                                        }
                                    }

                                    executorEmail = ExtractEmail(form187.RawRecord)?.Trim().Replace(";", ""); // Extract email
                                }
                            }
                        }
                    }

                    // Extract the ID number
                    idNumber = ExtractFirst13DigitNumber(rawRecord);
                }
                else
                {
                    _logger.LogWarning($"Raw record is missing expected sections: {rawRecord}");
                }
            }
            catch (Exception ex)
            {
                // Log exception details and rethrow for further investigation
                _logger.LogError(ex, $"Error extracting raw record for form ID: {form187.RecordId}. RawRecord: {rawRecord}");
                throw;
            }

            // Construct the XJ187 object
            var itemObject = new XJ187
            {
                Fk_RecordId = form187.RecordId,
                CaseNumber = caseNumber,
                IdNo = idNumber,
                Name = name,
                Particulars = particulars,
                NoticeDate = noticeDate,
                AccountDescription = description,
                SurvivingSpouse = spousedetails,
                InspectionPeriod = period,
                ExecutorName = executorName,
                ExecutorPhoneNumber = executorPhone,
                ExecutorEmail = executorEmail,
                RawRecord = rawRecord,
                DateCreated = (DateTime)form187.DateCreated,
                DateImported = DateTime.Now
            };

            return await Task.FromResult(itemObject);
        }

        [NonAction]
        public async Task NotifyClientWhenAllJobsComplete(string userId, int importId)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user != null)
            {
                await _smtpService.SendProcessResultMailbySmtp(user.Email, user.Name);
            }
        }

        [HttpPost("searchLog")]
        public async Task<IActionResult> Create([FromBody] CreateSearchLogRequestDto createSearchLogRequestDto)
        {
            var newSearchLog = new SearchLog
            {
                UserId = createSearchLogRequestDto.UserId,
                Type = createSearchLogRequestDto.Type,
                SearchString = createSearchLogRequestDto.SearchString,
                Date = DateTime.Now,
            };

            var searchLog = await _searchLogRepo.AddAsync(newSearchLog);

            if (searchLog == null)
            {
                return StatusCode(403, "Failed to store search log.");
            }

            return Ok(searchLog);
        }

        [HttpGet("searchLog")]
        public async Task<IActionResult> GetAll()
        {
            var clientsWithSearchLogs = await _searchLogRepo.GetAllAsync();

            if (clientsWithSearchLogs == null)
            {
                return StatusCode(403, "Failed to fetch search logs.");
            }

            return Ok(clientsWithSearchLogs);
        }
    }
}
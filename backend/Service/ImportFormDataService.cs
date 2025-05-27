using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using backend.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Service
{
    public class ImportFormDataService
    {
        private readonly FormDataDbContext _formDataDbContext;
        private readonly ApplicationDBContext _context;
        private readonly IImportRepository _importRepo;
        private readonly IFormDataRepository _formDataRepo;

        public ImportFormDataService(FormDataDbContext formDataDbContext, ApplicationDBContext context, IImportRepository importRepo, IFormDataRepository formDataRepo)
        {
            _formDataDbContext = formDataDbContext;
            _context = context;
            _importRepo = importRepo;
            _formDataRepo = formDataRepo;
        }

        public async Task ImportFormdataTask(string action, string userId = null)
        {
            await HandleImportAsync("J193", userId, 
                _formDataRepo.GetImportFormData193Async, 
                ExtractRawRecord193Async, 
                _formDataRepo.AddBulkFormData193Async);

            await HandleImportAsync("J187", userId, 
                _formDataRepo.GetImportFormData187Async, 
                ExtractRawRecord187Async, 
                _formDataRepo.AddBulkFormData187Async);
        }

        private async Task HandleImportAsync<TForm, TExtracted>(
            string importType,
            string userId,
            Func<Task<List<TForm>>> fetchFormDataFunc,
            Func<TForm, Task<TExtracted>> extractFunc,
            Func<List<TExtracted>, Task> bulkInsertFunc)
        {
            var import = new Import
            {
                UserId = userId ?? null,
                Type = importType,
                Progress = 0,
                Records = 0,
                StartDate = DateTime.Now,
                EndDate = null
            };

            var savedImport = await _importRepo.AddImportDataAsync(import);

            if (savedImport == null)
            {
                throw new InvalidOperationException($"Failed to add import data for type {importType}");
            }

            var formData = await fetchFormDataFunc().ConfigureAwait(false);

            if (formData == null || !formData.Any())
            {
                await _importRepo.UpdateImportEndDateAsync(savedImport.Id).ConfigureAwait(false);
                return;
            }

            const int batchSize = 100;
            var totalRecords = formData.Count;
            await _importRepo.UpdateImportRecordsAsync(savedImport.Id, totalRecords).ConfigureAwait(false);

            int totalProcessed = 0;

            for (int i = 0; i < totalRecords; i += batchSize)
            {
                var batch = formData.Skip(i).Take(batchSize).ToList();
                if (!batch.Any()) break;

                var formattedRecords = new List<TExtracted>();

                foreach (var record in batch)
                {
                    try
                    {
                        var formatted = await extractFunc(record).ConfigureAwait(false);
                        formattedRecords.Add(formatted);
                    }
                    catch (Exception ex)
                    {
                        // Optional: log exception
                    }
                }

                totalProcessed += batch.Count;
                await _importRepo.UpdateImportProgressAsync(savedImport.Id, totalProcessed).ConfigureAwait(false);
                await bulkInsertFunc(formattedRecords).ConfigureAwait(false);
            }

            await _importRepo.UpdateImportEndDateAsync(savedImport.Id).ConfigureAwait(false);
        }

        [NonAction]
        public string ExtractEmail(string text)
        {
            // Email regex pattern
            const string emailPattern = @"\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b";
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
                                }
                            }
                        }
                    }

                    executorEmail = ExtractEmail(form187.RawRecord)?.Trim().Replace(";", ""); // Extract email

                    if (form187.RawRecord.Contains("Tel:"))
                    {
                        // executorPhone = Regex.Replace(form187.RawRecord.Split("Tel:")[1].Replace(".", "").Trim(), "[^0-9]", ""); // Extract phone number
                        var match = Regex.Match(form187.RawRecord, @"Tel:\s*([\d\s]+)");
                        if (match.Success)
                        {
                            executorPhone = match.Groups[1].Value;
                        }
                    } else
                    {
                        if(!string.IsNullOrEmpty(executorEmail))
                        {
                            var parts = form187.RawRecord.Split(executorEmail);
                            if (parts.Length > 1)
                            {
                                executorPhone = parts[1].Trim().Replace(",", "").Replace(".", "");
                            }
                            else
                            {
                                // _logger.LogWarning($"Phone number extraction failed after splitting by email for record: {rawRecord}");
                            }
                        }
                    }

                    // Extract the ID number
                    idNumber = ExtractFirst13DigitNumber(rawRecord);
                }
                else
                {
                    // _logger.LogWarning($"Raw record is missing expected sections: {rawRecord}");
                }
            }
            catch (Exception ex)
            {
                // Log exception details and rethrow for further investigation
                // _logger.LogError(ex, $"Error extracting raw record for form ID: {form187.RecordId}. RawRecord: {rawRecord}");
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
    }
}
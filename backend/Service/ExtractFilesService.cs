using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using UglyToad.PdfPig;
using UglyToad.PdfPig.Content;

namespace backend.Service
{
    public class ExtractFilesService
    {
        private readonly FormDataDbContext _formDataDbContext;
        private readonly ApplicationDBContext _context;
        private readonly string _folderPath = "D:\\LegalFiles";
        private readonly string _extractedFolderPath = "D:\\LegalFiles\\ExtractedFiles";
        private readonly string _logFolderPath = "D:\\LegalFiles\\Logs";
        public ExtractFilesService(FormDataDbContext formDataDbContext, ApplicationDBContext context)
        {
            _formDataDbContext = formDataDbContext;
            _context = context;
        }

        public async Task ExtractRecordsFromFiles(string action, string userId = null)
        {
            var existingHistory = await _context.ExtractHistories
                .FirstOrDefaultAsync(h => h.EndTime == null && h.ByAction == action && h.UserId == userId);

            if (existingHistory != null)
            {
                Console.WriteLine("An extraction process is already running for this user and action.");
                return;
            }

            var pdfFiles = Directory.GetFiles(_folderPath, "*.pdf");

            var extractedFiles = ReadExtractedFiles();
            var filesCount = 0;

            var newExtractHistory = new ExtractHistory {
                FilesCount = pdfFiles.Length,
                ByAction = action,
                UserId = userId,
                StartTime = DateTime.Now,
                EndTime = null
            };

            await _context.ExtractHistories.AddAsync(newExtractHistory);
            await _context.SaveChangesAsync();

            foreach (var filePath in pdfFiles)
            {
                var fileName = Path.GetFileName(filePath);
                byte[] fileContents = await File.ReadAllBytesAsync(filePath);

                if(extractedFiles.Contains(fileName))
                {
                    Console.WriteLine($"File {fileName} has already been extracted.");
                    continue;
                }


                using (var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read))
                using (var document = PdfDocument.Open(stream))
                {
                    var allText = new System.Text.StringBuilder();
                    var lastPageText = new System.Text.StringBuilder();

                    var firstPage = document.GetPages().LastOrDefault();

                    if (firstPage != null)
                    {
                        lastPageText.AppendLine(firstPage.Text);
                    }

                    foreach (var page in document.GetPages())
                    {
                        allText.AppendLine(page.Text);
                    }

                    DateTime noticeDate = new DateTime(2000, 1, 1); 
                    
                    if(lastPageText.ToString().Contains("GOVERNMENT GAZETTE") || lastPageText.ToString().Contains("STAATSKOERANT"))
                    {
                        string[] parts = lastPageText.ToString().Split(new string[] { "GOVERNMENT GAZETTE" }, StringSplitOptions.None);

                        if(parts.Length == 1 || parts.Length == 0)
                        {
                            parts = lastPageText.ToString().Split(new string[] { "STAATSKOERANT" }, StringSplitOptions.None);
                        }
                        
                        string[] dateParts = parts[1].Split(new string[] { " " }, StringSplitOptions.None);

                        string day = dateParts[1];
                        string month = dateParts[2];
                        string year = dateParts[3].Substring(0, 4);

                        // int dayInt = int.Parse(day);
                        // int yearInt = int.Parse(year);

                        if (int.TryParse(day, out int dayInt) && 
                            int.TryParse(year, out int yearInt) &&
                            DateTime.TryParseExact(month, "MMMM", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime parsedMonth))
                        {
                            int monthNumber = parsedMonth.Month;
                            DateTime date = new DateTime(yearInt, monthNumber, dayInt);

                            if (date >= DateTime.Parse("2000-01-01") && date <= DateTime.Parse("9999-12-31"))
                            {
                                noticeDate = date;
                            }
                        }
                        else
                        {
                            noticeDate = new DateTime(2000, 1, 1);
                        }


                        // int monthNumber = DateTime.ParseExact(month, "MMMM", CultureInfo.InvariantCulture).Month;

                        // DateTime date = new DateTime(yearInt, monthNumber, dayInt);

                        // noticeDate = date;
                    }

                    string pdfText = allText.ToString().Replace(Environment.NewLine, "\\n");

                    // Save NoticeFile
                    Guid noticeFileId = Guid.NewGuid();
                    var newNoticeFile = new NoticeFile
                    {
                        NoticeFileId = noticeFileId,
                        FileName = fileName,
                        FileContents = fileContents,
                        DateCreated = DateTime.Now
                    };
                    
                    await _formDataDbContext.NoticeFiles.AddAsync(newNoticeFile);

                    await ProcessFormType("J193", pdfText, noticeDate, fileName, fileContents, noticeFileId);
                    await ProcessFormType("J187", pdfText, noticeDate, fileName, fileContents, noticeFileId);

                }

                filesCount++;

                var extractedFilePath = Path.Combine(_extractedFolderPath, fileName);
                File.Move(filePath, extractedFilePath);

                UpdateExtractedFiles(fileName);

                var newExtractedFile = new ExtractedFile {
                    HistoryId = newExtractHistory.Id,
                    FileName = fileName,
                    ProcessTime = DateTime.Now
                };

                await _context.ExtractedFiles.AddAsync(newExtractedFile);
            }

            // var extractHistory = await _context.ExtractHistories.FindAsync(newExtractHistory.Id);
            
            newExtractHistory.FilesCount = filesCount;
            newExtractHistory.EndTime = DateTime.Now;

            // await _context.ExtractHistories.AddAsync(newExtractHistory);
             _context.ExtractHistories.Update(newExtractHistory);
            await _context.SaveChangesAsync();

            // newExtractHistory.EndTime = DateTime.Now;
            // await _context.SaveChangesAsync();
        }

        private async Task ProcessFormType(string formType, string pdfText, DateTime noticeDate, string fileName, byte[] fileContents, Guid noticeFileId)
        {
            string startTerm = formType.Insert(1, " ");
            string endTerm = "Form/Vorm";

            int startIndex = pdfText.LastIndexOf(startTerm, StringComparison.OrdinalIgnoreCase);

            if (startIndex == -1)
            {
                if (startTerm.Contains(" "))
                {
                    startIndex = pdfText.LastIndexOf(startTerm.Replace(" ", ""), StringComparison.OrdinalIgnoreCase);
                }
                else
                {
                    startTerm = startTerm.Insert(1, " ");
                    startIndex = pdfText.LastIndexOf(startTerm, StringComparison.OrdinalIgnoreCase);
                }
            }

            // Check if startIndex is still -1 after attempts to find it
            if (startIndex != -1)
            {

                int endIndex = pdfText.IndexOf(endTerm, startIndex, StringComparison.OrdinalIgnoreCase);

                // If endTerm is not found, extract to the end of the text
                string extractedText = (endIndex != -1)
                    ? pdfText.Substring(startIndex, endIndex - startIndex)
                    : pdfText.Substring(startIndex);

                var records = ExtractRecords(extractedText);

                if(records.Count == 0) {
                    if (startTerm.Contains(" "))
                    {
                        startIndex = pdfText.LastIndexOf(startTerm.Replace(" ", ""), StringComparison.OrdinalIgnoreCase);
                    }
                    else
                    {
                        startTerm = startTerm.Insert(1, " ");
                        startIndex = pdfText.LastIndexOf(startTerm, StringComparison.OrdinalIgnoreCase);
                    }

                    int endIndex1 = pdfText.IndexOf(endTerm, startIndex, StringComparison.OrdinalIgnoreCase);

                    // If endTerm is not found, extract to the end of the text
                    string extractedText1 = (endIndex1 != -1)
                        ? pdfText.Substring(startIndex, endIndex1 - startIndex)
                        : pdfText.Substring(startIndex);

                    records = ExtractRecords(extractedText1);
                }

                // Save records based on form type
                if (formType == "J193")
                {
                    foreach (var record in records)
                    {
                        var formRecord = new J193FormRecord
                        {
                            RecordId = Guid.NewGuid(),
                            NoticeDate = noticeDate,
                            RawRecord = record,
                            CaseNumber = "",
                            NoticeFileId = noticeFileId,
                            FormId = "Form/Vorm J193",
                            DateCreated = DateTime.Now
                        };
                        await _formDataDbContext.J193FormRecords.AddAsync(formRecord);
                    }
                }
                else if (formType == "J187")
                {
                    foreach (var record in records)
                    {
                        var formRecord = new J187FormRecord
                        {
                            RecordId = Guid.NewGuid(),
                            NoticeDate = noticeDate,
                            DateCreated = DateTime.Now,
                            NoticeFileId = noticeFileId,
                            CaseNumber = "",
                            FormId = "Form/Vorm J187",
                            RawRecord = record
                        };
                        await _formDataDbContext.J187FormRecords.AddAsync(formRecord);
                    }
                }

                await _formDataDbContext.SaveChangesAsync();
            }

        }

        private List<string> ExtractRecords(string extractedText)
        {
            string pattern = @"(\d{4,6}/\d{2,4}[-—](?:\(2\))?[^\0]+?)(?=(\d{3,6}/\d{2,4}[-—](?:\(2\))?|$))";
            var records = new List<string>();
            MatchCollection matches = Regex.Matches(extractedText, pattern);

            foreach (System.Text.RegularExpressions.Match match in matches)
            {
                string matchValue = match.Value.Trim();
                bool isLastMatch = match.Index == matches[matches.Count - 1].Index;

                if (isLastMatch)
                {
                    if(matchValue.Contains("\\n")) {
                        string[] parts = matchValue.Split(new string[] { "\\n" }, StringSplitOptions.None);
                    
                        records.Add(parts[0]);
                    }
                    else 
                    {
                        int lastPeriodIndex = matchValue.LastIndexOf('.');

                        if (lastPeriodIndex >= 0)
                        {
                            string textAfterPeriod = matchValue.Substring(lastPeriodIndex + 1).Trim();
                            string lastPart = matchValue.Substring(0, lastPeriodIndex);

                            if (lastPart.EndsWith("No", StringComparison.OrdinalIgnoreCase))
                            {
                                lastPeriodIndex = lastPart.LastIndexOf('.');
                                records.Add(matchValue.Substring(0, lastPeriodIndex));
                            }
                            else
                            {
                                records.Add(lastPart);
                            }
                        }
                        else
                        {
                            records.Add(matchValue);
                        }
                    }
                }
                else
                {
                    records.Add(matchValue);
                }
            }

            return records;
        }

        private HashSet<string> ReadExtractedFiles()
        {
            var filePath = Path.Combine(_logFolderPath, "extracted_files.txt");

            // Extract only file names from each line and ignore the timestamp
            if (File.Exists(filePath))
            {
                return new HashSet<string>(
                    File.ReadLines(filePath)
                        .Select(line => line.Split('|')[0].Trim()) // Keep only the file name part
                );
            }

            return new HashSet<string>();
        }

        private void UpdateExtractedFiles(string fileName)
        {
            var filePath = Path.Combine(_logFolderPath, "extracted_files.txt");
            var dateTime = DateTime.Now.ToString("yyyyMMdd HH:mm");

            using (var writer = File.AppendText(filePath))
            {
                writer.WriteLine($"{fileName} | {dateTime}");
            }
        }
    }
}
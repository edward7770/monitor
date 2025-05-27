using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using backend.Data;
using backend.Dtos.FormData;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;

namespace backend.Repository
{
    public class FormDataRepository : IFormDataRepository
    {
        FormDataDbContext _formDataContext;
        ApplicationDBContext _context;
        readonly private IWebHostEnvironment _hostEnvironment;

        public FormDataRepository(FormDataDbContext formDataDbContext, ApplicationDBContext context, IWebHostEnvironment hostEnvironment)
        {
            _formDataContext = formDataDbContext;
            _context = context;
            _hostEnvironment = hostEnvironment;
        }

        public async Task<List<XJ187>> AddBulkFormData187Async(List<XJ187> xJ187s)
        {
            await _context.XJ187s.AddRangeAsync(xJ187s);
            await _context.SaveChangesAsync();

            return xJ187s;
        }

        public async Task<List<XJ193>> AddBulkFormData193Async(List<XJ193> xJ193s)
        {
            await _context.XJ193s.AddRangeAsync(xJ193s);
            await _context.SaveChangesAsync();

            return xJ193s;
        }

        // public async Task<List<MatchResult>> FilterByIdNumberAsync(int matchId, string idNumber)
        // {
        //     var matchFormRecords = new List<MatchResult>();

        //     try
        //     {
        //         // Check if IdNumber is null or empty before proceeding
        //         if (string.IsNullOrEmpty(idNumber))
        //         {
        //             return matchFormRecords; // Return empty list as no IdNumber is provided
        //         }

        //         // Retrieve the current date only once
        //         var currentDate = DateTime.Now;

        //         // Query both J187 and J193 records with filters applied
        //         var form187Records = await _context.XJ187s
        //             .Where(record => record.IdNo == idNumber)
        //             .ToListAsync();

        //         var form193Records = await _context.XJ193s
        //             .Where(record => record.IdNo == idNumber)
        //             .ToListAsync();

        //         // Map J187 records to MatchResult
        //         matchFormRecords.AddRange(form187Records.Select(form187 => new MatchResult
        //         {
        //             MatchId = matchId,
        //             IdNumber = idNumber,
        //             Type = "J187",
        //             RecordId = form187.Fk_RecordId,
        //             RawRecord = form187.RawRecord,
        //             DateMatched = currentDate,
        //             MatchedStep = 0
        //         }));

        //         // Map J193 records to MatchResult
        //         matchFormRecords.AddRange(form193Records.Select(form193 => new MatchResult
        //         {
        //             MatchId = matchId,
        //             IdNumber = idNumber,
        //             Type = "J193",
        //             RecordId = form193.Fk_RecordId,
        //             RawRecord = form193.RawRecord,
        //             DateMatched = currentDate,
        //             MatchedStep = 0
        //         }));
        //     }
        //     catch (Exception ex)
        //     {
        //         // Log the exception if a logger is available (assuming _logger is injected)

        //         // Optionally rethrow or handle the exception
        //         throw;
        //     }

        //     return matchFormRecords;
        // }

        public async Task<List<MatchResult>> FilterByIdNumberAsync(int matchId)
        {
            var matchFormRecords = new List<MatchResult>();
            var matchedFolderPath = Path.Combine(_hostEnvironment.ContentRootPath, "Uploads", "MatchedFiles");
            string matchedFileName = Guid.NewGuid().ToString() + ".xlsx";
            var filePath = Path.Combine(matchedFolderPath, matchedFileName);

            try
            {
                if (!Directory.Exists(matchedFolderPath))
                {
                    Directory.CreateDirectory(matchedFolderPath);
                }

                // Retrieve the current date only once
                var currentDate = DateTime.Now;

                // Query both J187 and J193 records with filters applied
                var form187Records = await _context.XJ187s
                    .Join(_context.MatchDatas,
                       xJ187 => xJ187.IdNo,
                       matchData => matchData.IdNumber,
                       (xJ187, matchData) => new {xJ187, matchData})
                    .Where(x => x.matchData.MatchId == matchId)
                    .ToListAsync();

                var form193Records = await _context.XJ193s
                    .Join(_context.MatchDatas,
                       xJ193 => xJ193.IdNo,
                       matchData => matchData.IdNumber,
                       (xJ193, matchData) => new {xJ193, matchData})
                    .Where(x => x.matchData.MatchId == matchId)
                    .ToListAsync();

                using (var package = new ExcelPackage())
                {
                    // Add J187 sheet
                    var worksheetJ187 = package.Workbook.Worksheets.Add("J187");
                    worksheetJ187.Cells[1, 1].Value = "IdNo";
                    worksheetJ187.Cells[1, 2].Value = "CaseNumber";
                    worksheetJ187.Cells[1, 3].Value = "Name";
                    worksheetJ187.Cells[1, 4].Value = "Particulars";
                    worksheetJ187.Cells[1, 5].Value = "NoticeDate";
                    worksheetJ187.Cells[1, 6].Value = "AccountDescription";
                    worksheetJ187.Cells[1, 7].Value = "SurvivingSpouse";
                    worksheetJ187.Cells[1, 8].Value = "InspectionPeriod";
                    worksheetJ187.Cells[1, 9].Value = "ExecutorName";
                    worksheetJ187.Cells[1, 10].Value = "ExecutorPhoneNumber";
                    worksheetJ187.Cells[1, 11].Value = "ExecutorEmail";
                    worksheetJ187.Cells[1, 12].Value = "RawRecord";

                    for (int i = 0; i < form187Records.Count; i++)
                    {
                        var record = form187Records[i].xJ187;
                        worksheetJ187.Cells[i + 2, 1].Value = record.IdNo;
                        worksheetJ187.Cells[i + 2, 2].Value = record.CaseNumber;
                        worksheetJ187.Cells[i + 2, 3].Value = record.Name;
                        worksheetJ187.Cells[i + 2, 4].Value = record.Particulars;
                        worksheetJ187.Cells[i + 2, 5].Value = record.NoticeDate;
                        worksheetJ187.Cells[i + 2, 6].Value = record.AccountDescription;
                        worksheetJ187.Cells[i + 2, 7].Value = record.SurvivingSpouse;
                        worksheetJ187.Cells[i + 2, 8].Value = record.InspectionPeriod;
                        worksheetJ187.Cells[i + 2, 9].Value = record.ExecutorName;
                        worksheetJ187.Cells[i + 2, 10].Value = record.ExecutorPhoneNumber;
                        worksheetJ187.Cells[i + 2, 11].Value = record.ExecutorEmail;
                        worksheetJ187.Cells[i + 2, 12].Value = record.RawRecord;
                    }

                    // Add J193 sheet
                    var worksheetJ193 = package.Workbook.Worksheets.Add("J193");
                    worksheetJ193.Cells[1, 1].Value = "IdNo";
                    worksheetJ193.Cells[1, 2].Value = "CaseNumber";
                    worksheetJ193.Cells[1, 3].Value = "Name";
                    worksheetJ193.Cells[1, 4].Value = "Particulars";
                    worksheetJ193.Cells[1, 5].Value = "NoticeDate";
                    worksheetJ193.Cells[1, 6].Value = "RawRecord";

                    for (int i = 0; i < form193Records.Count; i++)
                    {
                        var record = form193Records[i].xJ193;
                        worksheetJ193.Cells[i + 2, 1].Value = record.IdNo;
                        worksheetJ193.Cells[i + 2, 2].Value = record.CaseNumber;
                        worksheetJ193.Cells[i + 2, 3].Value = record.Name;
                        worksheetJ193.Cells[i + 2, 4].Value = record.Particulars;
                        worksheetJ193.Cells[i + 2, 5].Value = record.NoticeDate;
                        worksheetJ193.Cells[i + 2, 6].Value = record.RawRecord;
                    }

                    // Save the Excel package to the specified file path
                    await SaveExcelPackageAsync(package, filePath);
                }

                // Map J187 records to MatchResult
                matchFormRecords.AddRange(form187Records.Select(form187 => new MatchResult
                {
                    MatchId = matchId,
                    IdNumber = form187.matchData.IdNumber,
                    Type = "J187",
                    RecordId = form187.xJ187.Fk_RecordId,
                    RawRecord = form187.xJ187.RawRecord,
                    DateMatched = currentDate,
                    MatchedStep = 0
                }));

                // Map J193 records to MatchResult
                matchFormRecords.AddRange(form193Records.Select(form193 => new MatchResult
                {
                    MatchId = matchId,
                    IdNumber = form193.matchData.IdNumber,
                    Type = "J193",
                    RecordId = form193.xJ193.Fk_RecordId,
                    RawRecord = form193.xJ193.RawRecord,
                    DateMatched = currentDate,
                    MatchedStep = 0
                }));

                var matchedRecord = await _context.Matches.FindAsync(matchId);
                matchedRecord.J187MatchedCount = form187Records.Count;
                matchedRecord.J193MatchedCount = form193Records.Count;
                matchedRecord.ResultFileName = matchedFileName;
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Log the exception if a logger is available (assuming _logger is injected)

                // Optionally rethrow or handle the exception
                throw;
            }

            return matchFormRecords;
        }

        private async Task SaveExcelPackageAsync(ExcelPackage package, string filePath)
        {
            await Task.Run(() => package.SaveAs(new FileInfo(filePath)));
        }


        // public async Task<PagedResult<FormRecord187Dto>> GetAllForm187Async(int page, int pageSize, string sortColumn, string sortDirection, string search)
        // {
        //     var query = _formDataContext.J187FormRecords.AsQueryable();

        //     if (!string.IsNullOrEmpty(search))
        //     {
        //         query = query.Where(record => record.RawRecord != null && record.RawRecord.Contains(search));
        //     }

        //     if (!string.IsNullOrEmpty(sortColumn))
        //     {
        //         if (sortDirection.ToLower() == "asc")
        //         {
        //             query = query.OrderBy(e => EF.Property<object>(e, sortColumn));
        //         }
        //         else
        //         {
        //             query = query.OrderByDescending(e => EF.Property<object>(e, sortColumn));
        //         }
        //     }

        //     var totalRecords = await query.CountAsync();

        //     var rawRecords = await query
        //         .Skip(page * pageSize)
        //         .Take(pageSize)
        //         .Select(record => new FormRecord187Dto
        //         {
        //             RawRecord = record.RawRecord,
        //             IdNumber = record.IdNumber,
        //             NoticeDate = record.NoticeDate
        //         })
        //         .ToListAsync();

        //     return new PagedResult<FormRecord187Dto>
        //     {
        //         TotalRecords = totalRecords,
        //         Data = rawRecords
        //     };
        // }
        public async Task<PagedResult<FormRecordX187Dto>> GetAllForm187Async(int page, int pageSize, string sortColumn, string sortDirection, string search, string searchOption)
        {
            var query = _context.XJ187s.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                if(searchOption == "") {
                    query = query.Where(record => record.RawRecord != null && record.RawRecord.Contains(search));
                } else {
                    if (searchOption == "CaseNumber")
                    {
                        query = query.Where(record => record.CaseNumber != null && record.CaseNumber.Contains(search));
                    }
                    else if (searchOption == "IdNo")
                    {
                        query = query.Where(record => record.IdNo != null && record.IdNo.Contains(search));
                    }
                    else if (searchOption == "Name")
                    {
                        query = query.Where(record => record.Name != null && record.Name.Contains(search));
                    }
                    else if (searchOption == "Particulars")
                    {
                        query = query.Where(record => record.Particulars != null && record.Particulars.Contains(search));
                    }
                     else if (searchOption == "ExecutorName")
                    {
                        query = query.Where(record => record.ExecutorName != null && record.ExecutorName.Contains(search));
                    }
                }
            }

            if (!string.IsNullOrEmpty(sortColumn))
            {
                if (sortDirection.ToLower() == "asc")
                {
                    query = query.OrderBy(e => EF.Property<object>(e, sortColumn));
                }
                else
                {
                    query = query.OrderByDescending(e => EF.Property<object>(e, sortColumn));
                }
            }

            var totalRecords = await query.CountAsync();

            var rawRecords = await query
                .Skip(page * pageSize)
                .Take(pageSize)
                .Select(record => new FormRecordX187Dto
                {
                    CaseNumber = record.CaseNumber,
                    IdNumber = record.IdNo,
                    Name = record.Name,
                    Particulars = record.Particulars,
                    NoticeDate = record.NoticeDate,
                    Description = record.AccountDescription,
                    Spousedetails = record.SurvivingSpouse,
                    Period = record.InspectionPeriod,
                    ExecutorName = record.ExecutorName,
                    ExecutorPhone = record.ExecutorPhoneNumber,
                    ExecutorEmail =record.ExecutorEmail,
                    RawRecord = record.RawRecord
                })
                .ToListAsync();

            return new PagedResult<FormRecordX187Dto>
            {
                TotalRecords = totalRecords,
                Data = rawRecords
            };
        }

        // public async Task<PagedResult<FormRecord193Dto>> GetAllForm193Async(int page, int pageSize, string sortColumn, string sortDirection, string search)
        // {
        //     var query = _formDataContext.J193FormRecords.AsQueryable();

        //     if (!string.IsNullOrEmpty(search))
        //     {
        //         query = query.Where(record => record.RawRecord != null && record.RawRecord.Contains(search));
        //     }

        //     if (!string.IsNullOrEmpty(sortColumn))
        //     {
        //         if (sortDirection.ToLower() == "asc")
        //         {
        //             query = query.OrderBy(e => EF.Property<object>(e, sortColumn));
        //         }
        //         else
        //         {
        //             query = query.OrderByDescending(e => EF.Property<object>(e, sortColumn));
        //         }
        //     }

        //     var totalRecords = await query.CountAsync();

        //     var rawRecords = await query
        //         .Skip(page * pageSize)
        //         .Take(pageSize)
        //         .Select(record => new FormRecord193Dto
        //         {
        //             RawRecord = record.RawRecord,
        //             NoticeDate = record.NoticeDate
        //         })
        //         .ToListAsync();

        //     return new PagedResult<FormRecord193Dto>
        //     {
        //         TotalRecords = totalRecords,
        //         Data = rawRecords
        //     };
        // }
        public async Task<PagedResult<FormRecordX193Dto>> GetAllForm193Async(int page, int pageSize, string sortColumn, string sortDirection, string search, string searchOption)
        {
            var query = _context.XJ193s.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                if(searchOption == "") {
                    query = query.Where(record => record.RawRecord != null && record.RawRecord.Contains(search));
                } else {
                    if (searchOption == "CaseNumber")
                    {
                        query = query.Where(record => record.CaseNumber != null && record.CaseNumber.Contains(search));
                    }
                    else if (searchOption == "IdNo")
                    {
                        query = query.Where(record => record.IdNo != null && record.IdNo.Contains(search));
                    }
                    else if (searchOption == "Name")
                    {
                        query = query.Where(record => record.Name != null && record.Name.Contains(search));
                    }
                    else if (searchOption == "Particulars")
                    {
                        query = query.Where(record => record.Particulars != null && record.Particulars.Contains(search));
                    }
                }
            }

            if (!string.IsNullOrEmpty(sortColumn))
            {
                if (sortDirection.ToLower() == "asc")
                {
                    query = query.OrderBy(e => EF.Property<object>(e, sortColumn));
                }
                else
                {
                    query = query.OrderByDescending(e => EF.Property<object>(e, sortColumn));
                }
            }

            var totalRecords = await query.CountAsync();

            var rawRecords = await query
                .Skip(page * pageSize)
                .Take(pageSize)
                .Select(record => new FormRecordX193Dto
                {
                    CaseNumber = record.CaseNumber,
                    IdNumber = record.IdNo,
                    Name = record.Name,
                    Particulars =record.Particulars,
                    NoticeDate = record.NoticeDate,
                    RawRecord = record.RawRecord
                })
                .ToListAsync();

            return new PagedResult<FormRecordX193Dto>
            {
                TotalRecords = totalRecords,
                Data = rawRecords
            };
        }

        // public async Task<J187FormRecord> GetForm187ByRecordIdAsync(Guid RecordId)
        // {
        //     var formRecord = await _formDataContext.J187FormRecords.FirstOrDefaultAsync(x => x.RecordId == RecordId);

        //     return formRecord;
        // }

        // public async Task<J193FormRecord> GetForm193ByRecordIdAsync(Guid RecordId)
        // {
        //     var formRecord = await _formDataContext.J193FormRecords.FirstOrDefaultAsync(x => x.RecordId == RecordId);

        //     return formRecord;
        // }
        public async Task<FormRecordX187Dto> GetForm187ByRecordIdAsync(Guid RecordId)
        {
            var formRecord = await _context.XJ187s.Where(x => x.Fk_RecordId == RecordId).Select(x => new FormRecordX187Dto {
                CaseNumber = x.CaseNumber,
                IdNumber = x.IdNo,
                Name = x.Name,
                Particulars = x.Particulars,
                NoticeDate = x.NoticeDate,
                Description = x.AccountDescription,
                Spousedetails = x.SurvivingSpouse,
                Period = x.InspectionPeriod,
                ExecutorName = x.ExecutorName,
                ExecutorPhone = x.ExecutorPhoneNumber,
                ExecutorEmail =x.ExecutorEmail,
                RawRecord = x.RawRecord
            }).FirstOrDefaultAsync();

            return formRecord;
        }

        public async Task<FormRecordX193Dto> GetForm193ByRecordIdAsync(Guid RecordId)
        {
            var formRecord = await _context.XJ193s.Where(x => x.Fk_RecordId == RecordId).Select(x => new FormRecordX193Dto {
                CaseNumber = x.CaseNumber,
                IdNumber = x.IdNo,
                Name = x.Name,
                Particulars = x.Particulars,
                NoticeDate = x.NoticeDate,
                RawRecord = x.RawRecord
            }).FirstOrDefaultAsync();

            return formRecord;
        }

        public async Task<List<J187FormRecord>> GetImportFormData187Async()
        {
            var maxDateCreated = await _context.XJ187s.MaxAsync(x => (DateTime?)x.DateCreated);

            List<J187FormRecord> data = new List<J187FormRecord>();

            if (maxDateCreated == null)
            {
                data = await _formDataContext.J187FormRecords.OrderBy(x => x.DateCreated).ToListAsync();
            }
            else
            {
                data = await _formDataContext.J187FormRecords.Where(x => x.DateCreated > maxDateCreated).OrderBy(x => x.DateCreated).ToListAsync();
            }

            return data;
        }

        public async Task<List<J193FormRecord>> GetImportFormData193Async()
        {
            var maxDateCreated = await _context.XJ193s.MaxAsync(x => (DateTime?)x.DateCreated);

            List<J193FormRecord> data = new List<J193FormRecord>();

            if (maxDateCreated == null)
            {
                data = await _formDataContext.J193FormRecords.OrderBy(x => x.DateCreated).ToListAsync();
            }
            else
            {
                data = await _formDataContext.J193FormRecords.Where(x => x.DateCreated > maxDateCreated).OrderBy(x => x.DateCreated).ToListAsync();
            }

            return data;
        }

        public async Task<List<XJ187>> GetLatestForm187Async()
        {
            var allMatchedResults = await _context.MatchResults.ToListAsync();

            if (allMatchedResults.Count > 0)
            {
                var maxMatchedStep = await _context.MatchResults.MaxAsync(x => x.MatchedStep);

                if (maxMatchedStep == 0)
                {
                    var lastMonitorDate = await _context.MatchResults.MinAsync(x => x.DateMatched);
                    var latestRecords = await _context.XJ187s.Where(x => x.DateCreated > lastMonitorDate).ToListAsync();
                    return latestRecords;
                }
                else
                {
                    var lastMonitorDate = await _context.MatchResults.Where(x => x.MatchedStep != 0).MaxAsync(x => x.DateMatched);
                    var latestRecords = await _context.XJ187s.Where(x => x.DateCreated > lastMonitorDate).ToListAsync();
                    return latestRecords;
                }
            }
            else
            {
                var lastMonitorDate = DateTime.Now.AddDays(-3);
                var latestRecords = await _context.XJ187s.Where(x => x.DateCreated > lastMonitorDate).ToListAsync();
                return latestRecords;
            }
        }

        public async Task<List<XJ193>> GetLatestForm193Async()
        {
            var allMatchedResults = await _context.MatchResults.ToListAsync();

            if (allMatchedResults.Count > 0)
            {
                var maxMatchedStep = await _context.MatchResults.MaxAsync(x => x.MatchedStep);

                if (maxMatchedStep == 0)
                {
                    var lastMonitorDate = await _context.MatchResults.MinAsync(x => x.DateMatched);
                    var latestRecords = await _context.XJ193s.Where(x => x.DateCreated > lastMonitorDate).ToListAsync();
                    return latestRecords;
                }
                else
                {
                    var lastMonitorDate = await _context.MatchResults.Where(x => x.MatchedStep != 0).MaxAsync(x => x.DateMatched);
                    var latestRecords = await _context.XJ193s.Where(x => x.DateCreated > lastMonitorDate).ToListAsync();
                    return latestRecords;
                }
            }
            else
            {
                var lastMonitorDate = DateTime.Now.AddDays(-3);
                var latestRecords = await _context.XJ193s.Where(x => x.DateCreated > lastMonitorDate).ToListAsync();
                return latestRecords;
            }
        }
    }
}
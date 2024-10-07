using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Dtos.FormData;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class FormDataRepository : IFormDataRepository
    {
        FormDataDbContext _formDataContext;
        ApplicationDBContext _context;

        public FormDataRepository(FormDataDbContext formDataDbContext, ApplicationDBContext context)
        {
            _formDataContext = formDataDbContext;
            _context = context;
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

        public async Task<List<MatchResult>> FilterByIdNumberAsync(int matchId, string idNumber)
        {
            var matchFormRecords = new List<MatchResult>();

            try
            {
                // Check if IdNumber is null or empty before proceeding
                if (string.IsNullOrEmpty(idNumber))
                {
                    return matchFormRecords; // Return empty list as no IdNumber is provided
                }

                // Retrieve the current date only once
                var currentDate = DateTime.Now;

                // Query both J187 and J193 records with filters applied
                var form187Records = await _formDataContext.J187FormRecords
                    .Where(record => record.RawRecord != null && record.RawRecord.Contains(idNumber))
                    .ToListAsync();

                var form193Records = await _formDataContext.J193FormRecords
                    .Where(record => record.RawRecord != null && record.RawRecord.Contains(idNumber))
                    .ToListAsync();

                // Map J187 records to MatchResult
                matchFormRecords.AddRange(form187Records.Select(form187 => new MatchResult
                {
                    MatchId = matchId,
                    IdNumber = idNumber,
                    Type = "J187",
                    RecordId = form187.RecordId,
                    RawRecord = form187.RawRecord,
                    DateMatched = currentDate,
                    MatchedStep = 0
                }));

                // Map J193 records to MatchResult
                matchFormRecords.AddRange(form193Records.Select(form193 => new MatchResult
                {
                    MatchId = matchId,
                    IdNumber = idNumber,
                    Type = "J193",
                    RecordId = form193.RecordId,
                    RawRecord = form193.RawRecord,
                    DateMatched = currentDate,
                    MatchedStep = 0
                }));
            }
            catch (Exception ex)
            {
                // Log the exception if a logger is available (assuming _logger is injected)

                // Optionally rethrow or handle the exception
                throw;
            }

            return matchFormRecords;
        }


        public async Task<PagedResult<FormRecord187Dto>> GetAllForm187Async(int page, int pageSize, string sortColumn, string sortDirection, string search)
        {
            var query = _formDataContext.J187FormRecords.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(record => record.RawRecord != null && record.RawRecord.Contains(search));
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
                .Select(record => new FormRecord187Dto
                {
                    RawRecord = record.RawRecord,
                    IdNumber = record.IdNumber,
                    NoticeDate = record.NoticeDate
                })
                .ToListAsync();

            return new PagedResult<FormRecord187Dto>
            {
                TotalRecords = totalRecords,
                Data = rawRecords
            };
        }

        public async Task<PagedResult<FormRecord193Dto>> GetAllForm193Async(int page, int pageSize, string sortColumn, string sortDirection, string search)
        {
            var query = _formDataContext.J193FormRecords.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(record => record.RawRecord != null && record.RawRecord.Contains(search));
            }

            // if (!string.IsNullOrEmpty(search))
            // {
            //     query = query.Where(record =>
            //         (record.RawRecord != null && record.RawRecord.Contains(search)) ||
            //         (record.IdNumber != null && record.IdNumber.Contains(search)) ||
            //         (record.Name != null && record.Name.Contains(search)) ||
            //         (record.Particulars != null && record.Particulars.Contains(search)) ||
            //         (record.RawRecord != null && record.RawRecord.Contains(search)));
            // }

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
                .Select(record => new FormRecord193Dto
                {
                    RawRecord = record.RawRecord,
                    NoticeDate = record.NoticeDate
                })
                .ToListAsync();

            return new PagedResult<FormRecord193Dto>
            {
                TotalRecords = totalRecords,
                Data = rawRecords
            };
        }

        public async Task<J187FormRecord> GetForm187ByRecordIdAsync(Guid RecordId)
        {
            var formRecord = await _formDataContext.J187FormRecords.FirstOrDefaultAsync(x => x.RecordId == RecordId);

            return formRecord;
        }

        public async Task<J193FormRecord> GetForm193ByRecordIdAsync(Guid RecordId)
        {
            var formRecord = await _formDataContext.J193FormRecords.FirstOrDefaultAsync(x => x.RecordId == RecordId);

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

        public async Task<List<J187FormRecord>> GetLatestForm187Async()
        {
            var allMatchedResults = await _context.MatchResults.ToListAsync();

            if (allMatchedResults.Count > 0)
            {
                var maxMatchedStep = await _context.MatchResults.MaxAsync(x => x.MatchedStep);

                if (maxMatchedStep == 0)
                {
                    var lastMonitorDate = await _context.MatchResults.MinAsync(x => x.DateMatched);
                    var latestRecords = await _formDataContext.J187FormRecords.Where(x => x.DateCreated > lastMonitorDate).ToListAsync();
                    return latestRecords;
                }
                else
                {
                    var lastMonitorDate = await _context.MatchResults.Where(x => x.MatchedStep != 0).MaxAsync(x => x.DateMatched);
                    var latestRecords = await _formDataContext.J187FormRecords.Where(x => x.DateCreated > lastMonitorDate).ToListAsync();
                    return latestRecords;
                }
            }
            else
            {
                var lastMonitorDate = DateTime.Now.AddDays(-3);
                var latestRecords = await _formDataContext.J187FormRecords.Where(x => x.DateCreated > lastMonitorDate).ToListAsync();
                return latestRecords;
            }
        }

        public async Task<List<J193FormRecord>> GetLatestForm193Async()
        {
            var allMatchedResults = await _context.MatchResults.ToListAsync();

            if (allMatchedResults.Count > 0)
            {
                var maxMatchedStep = await _context.MatchResults.MaxAsync(x => x.MatchedStep);

                if (maxMatchedStep == 0)
                {
                    var lastMonitorDate = await _context.MatchResults.MinAsync(x => x.DateMatched);
                    var latestRecords = await _formDataContext.J193FormRecords.Where(x => x.DateCreated > lastMonitorDate).ToListAsync();
                    return latestRecords;
                }
                else
                {
                    var lastMonitorDate = await _context.MatchResults.Where(x => x.MatchedStep != 0).MaxAsync(x => x.DateMatched);
                    var latestRecords = await _formDataContext.J193FormRecords.Where(x => x.DateCreated > lastMonitorDate).ToListAsync();
                    return latestRecords;
                }
            }
            else
            {
                var lastMonitorDate = DateTime.Now.AddDays(-3);
                var latestRecords = await _formDataContext.J193FormRecords.Where(x => x.DateCreated > lastMonitorDate).ToListAsync();
                return latestRecords;
            }
        }
    }
}
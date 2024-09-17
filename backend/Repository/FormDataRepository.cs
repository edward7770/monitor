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

        public FormDataRepository(FormDataDbContext formDataDbContext)
        {
            _formDataContext = formDataDbContext;
        }

        public async Task<List<MatchResult>> FilterByIdNumberAsync(int MatchId, string IdNumber)
        {
            var matchFormRecords = new List<MatchResult>();
            var query187 = _formDataContext.J187FormRecords.AsQueryable();
            var query193 = _formDataContext.J193FormRecords.AsQueryable();

            if (!string.IsNullOrEmpty(IdNumber))
            {
                query187 = query187.Where(record => record.RawRecord != null && record.RawRecord.Contains(IdNumber));
                query193 = query193.Where(record => record.RawRecord != null && record.RawRecord.Contains(IdNumber));
            }

            var form187Records = await query187.ToListAsync();
            var form193Records = await query193.ToListAsync();

            foreach (var form187 in form187Records)
            {
                var matchForm187 = new MatchResult
                {
                    MatchId = MatchId,
                    IdNumber = IdNumber,
                    Type = "J187",
                    RecordId = form187.RecordId,
                    RawRecord = form187.RawRecord,
                    DateMatched = DateTime.Now
                };

                matchFormRecords.Add(matchForm187);
            }

            foreach (var form193 in form193Records)
            {
                var matchForm193 = new MatchResult
                {
                    MatchId = MatchId,
                    IdNumber = IdNumber,
                    Type = "J193",
                    RecordId = form193.RecordId,
                    RawRecord = form193.RawRecord,
                    DateMatched = DateTime.Now
                };

                matchFormRecords.Add(matchForm193);
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

        public async Task<List<J187FormRecord>> GetLatestForm187Async()
        {
            var latestDate = await _formDataContext.J187FormRecords.MaxAsync(x => x.DateCreated);

            var latestRecords = await _formDataContext.J187FormRecords.Where(x => x.DateCreated == latestDate).ToListAsync();

            return latestRecords;
        }

        public async Task<List<J193FormRecord>> GetLatestForm193Async()
        {
            var latestDate = await _formDataContext.J193FormRecords.MaxAsync(x => x.DateCreated);

            var latestRecords = await _formDataContext.J193FormRecords.Where(x => x.DateCreated == latestDate).ToListAsync();

            return latestRecords;
        }
    }
}
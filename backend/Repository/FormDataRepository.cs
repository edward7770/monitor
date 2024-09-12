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
                    IdNumber =  record.IdNumber,
                    NoticeDate = record.NoticeDate
                })
                .ToListAsync();

            return new PagedResult<FormRecord187Dto>
            {
                TotalRecords = totalRecords,
                Data = rawRecords
            };
        }

        public async Task<PagedResult<string>> GetAllForm193Async(int page, int pageSize, string sortColumn, string sortDirection, string search)
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
                .Select(record => record.RawRecord)
                .ToListAsync();

            return new PagedResult<string>
            {
                TotalRecords = totalRecords,
                Data = rawRecords
            };
        }
    }
}
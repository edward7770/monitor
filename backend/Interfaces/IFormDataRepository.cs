using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.FormData;
using backend.Models;

namespace backend.Interfaces
{
    public interface IFormDataRepository
    {
        Task<PagedResult<FormRecord187Dto>> GetAllForm187Async(int page, int pageSize, string sortColumn, string sortDirection, string search);
        Task<PagedResult<FormRecord193Dto>> GetAllForm193Async(int page, int pageSize, string sortColumn, string sortDirection, string search);
        Task<List<MatchResult>> FilterByIdNumberAsync(int MatchId, string IdNumber);
        Task<List<J187FormRecord>> GetLatestForm187Async();
        Task<List<J193FormRecord>> GetLatestForm193Async();
        Task<J187FormRecord> GetForm187ByRecordIdAsync(Guid RecordId);
        Task<J193FormRecord> GetForm193ByRecordIdAsync(Guid RecordId);
    }
}
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
        Task<PagedResult<FormRecordX187Dto>> GetAllForm187Async(int page, int pageSize, string sortColumn, string sortDirection, string search, string searchOption);
        Task<PagedResult<FormRecordX193Dto>> GetAllForm193Async(int page, int pageSize, string sortColumn, string sortDirection, string search, string searchOption);
        Task<List<MatchResult>> FilterByIdNumberAsync(int MatchId);
        Task<List<XJ187>> GetLatestForm187Async();
        Task<List<XJ193>> GetLatestForm193Async();
        Task<FormRecordX187Dto> GetForm187ByRecordIdAsync(Guid RecordId);
        Task<FormRecordX193Dto> GetForm193ByRecordIdAsync(Guid RecordId);
        Task<List<J187FormRecord>> GetImportFormData187Async();
        Task<List<J193FormRecord>> GetImportFormData193Async();
        Task<List<XJ193>> AddBulkFormData193Async(List<XJ193> xJ193s);
        Task<List<XJ187>> AddBulkFormData187Async(List<XJ187> xJ187s);
    }
}
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
        Task<PagedResult<string>> GetAllForm193Async(int page, int pageSize, string sortColumn, string sortDirection, string search);

    }
}
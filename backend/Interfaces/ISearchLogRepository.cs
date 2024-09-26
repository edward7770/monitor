using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Client;
using backend.Dtos.SearchLog;
using backend.Models;

namespace backend.Interfaces
{
    public interface ISearchLogRepository
    {
        Task<SearchLog> AddAsync(SearchLog createSearchLogRequestDto);
        Task<List<ClientWithSearchLogsDto>> GetAllAsync();
    }
}
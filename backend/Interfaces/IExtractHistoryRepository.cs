using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;

namespace backend.Interfaces
{
    public interface IExtractHistoryRepository
    {
        Task<List<ExtractHistory>> GetExtractHistories();
    }
}
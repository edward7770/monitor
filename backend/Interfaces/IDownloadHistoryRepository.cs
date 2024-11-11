using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;

namespace backend.Interfaces
{
    public interface IDownloadHistoryRepository
    {
        Task<List<DownloadHistory>> GetDownloadHistories();
    }
}
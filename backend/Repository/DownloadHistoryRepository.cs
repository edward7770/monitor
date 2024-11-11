using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class DownloadHistoryRepository : IDownloadHistoryRepository
    {
        private readonly ApplicationDBContext _context;
        public DownloadHistoryRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<List<DownloadHistory>> GetDownloadHistories()
        {
            var histories = await _context.DownloadHistories.Include(x => x.DownloadFiles).ToListAsync();

            return histories;
        }
    }
}
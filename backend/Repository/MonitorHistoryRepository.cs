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
    public class MonitorHistoryRepository : IMonitorHistoryRepository
    {
        ApplicationDBContext _context;
        public MonitorHistoryRepository(ApplicationDBContext context)
        {
            _context = context;
        }
        public async Task<MonitorHistory> AddMonitorHistoryAsync(MonitorHistory monitorHistory)
        {
            await _context.MonitorHistories.AddAsync(monitorHistory);
            await _context.SaveChangesAsync();

            return monitorHistory;
        }

        public async Task<List<MonitorHistory>> GetMonitorHistoriesAsync()
        {
            var monitorHistory = await _context.MonitorHistories.ToListAsync();
            
            return monitorHistory;
        }
    }
}
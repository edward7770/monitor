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
    public class ExtractHistoryRepository : IExtractHistoryRepository
    {
        private readonly ApplicationDBContext _context;
        public ExtractHistoryRepository(ApplicationDBContext context)
        {
            _context = context;
        }
        
        public async Task<List<ExtractHistory>> GetExtractHistories()
        {
            var histories = await _context.ExtractHistories.Include(x => x.ExtractedFiles).ToListAsync();

            return histories;
        }
    }
}
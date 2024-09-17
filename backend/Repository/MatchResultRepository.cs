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
    public class MatchResultRepository : IMatchResultRepository
    {
        ApplicationDBContext _context;
        public MatchResultRepository(ApplicationDBContext context)
        {
            _context = context;
        }
        public async Task<List<MatchResult>> AddAsync(List<MatchResult> matchResults)
        {
            foreach (var matchResult in matchResults)
            {
                var findSameMatches = await _context.MatchResults.Where(x => x.MatchId == matchResult.MatchId && x.RecordId == matchResult.RecordId).ToListAsync();

                if (findSameMatches.Count == 0)
                {
                    await _context.MatchResults.AddAsync(matchResult);
                }
            }

            await _context.SaveChangesAsync();

            return matchResults;
        }

        public async Task<MatchResult> UpdateAsync(int matchResultId)
        {
            var matchResult = await _context.MatchResults.FindAsync(matchResultId);
            matchResult.DownloadDate = DateTime.Now;

            await _context.SaveChangesAsync();
            return matchResult;
        }
    }
}
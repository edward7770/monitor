using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Dtos.MatchResult;
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
        public async Task<List<MatchResult>> AddAsync(int matchId, List<MatchResult> matchResults)
        {
            foreach (var matchResult in matchResults)
            {
                // var findSameMatches = await _context.MatchResults.Where(x => x.MatchId == matchResult.MatchId && x.RecordId == matchResult.RecordId).ToListAsync();

                // if (findSameMatches.Count == 0)
                // {
                // }
                await _context.MatchResults.AddAsync(matchResult);
            }

            if(matchId != 0)
            {
                var match = await _context.Matches.FindAsync(matchId);

                match.ProcessProgressRecords = matchResults.Count;
            }

            await _context.SaveChangesAsync();

            return matchResults;
        }

        public async Task<GetLastMatchedStepDto> GetLastMatchedStepAsync(int matchId)
        {
            var lastMatchedStep = await _context.MatchResults
                .Where(x => x.MatchId == matchId)
                .OrderByDescending(y => y.MatchedStep)
                .Select(y => y.MatchedStep)
                .FirstOrDefaultAsync();

            var lastMatchedDto = new GetLastMatchedStepDto
            {
                MatchedStep = lastMatchedStep
            };

            return lastMatchedDto;
        }

        public async Task<int> GetMatchedResultsCountByClient(string userId, DateTime startDate, DateTime endDate)
        {
            var matchedResultCount = await _context.MatchResults
                .Join(_context.Matches,
                    matchedResult => matchedResult.MatchId,
                    match => match.Id,
                    (matchedResult, match) => new { matchedResult, match })
                .Where(x => x.match.ClientId == userId && x.matchedResult.DownloadDate >= startDate && x.matchedResult.DownloadDate <= endDate)
                .CountAsync();

            return matchedResultCount;
        }

        public async Task<MatchResult> UpdateAsync(UpdateDownloadDateDto updateDownloadDateDto)
        {
            var matchResult = await _context.MatchResults.FirstOrDefaultAsync(x => x.MatchId == updateDownloadDateDto.MatchId && x.MatchedStep == updateDownloadDateDto.Step);

            matchResult.DownloadDate = DateTime.Now;
            
            await _context.SaveChangesAsync();

            return matchResult;
        }
    }
}
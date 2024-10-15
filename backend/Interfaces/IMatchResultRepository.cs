using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.MatchResult;
using backend.Models;

namespace backend.Interfaces
{
    public interface IMatchResultRepository
    {
        Task<List<MatchResult>> AddAsync(int matchId, List<MatchResult> matchResults);
        Task<MatchResult> UpdateAsync(UpdateDownloadDateDto updateDownloadDateDto);
        Task<GetLastMatchedStepDto> GetLastMatchedStepAsync(int matchId);
        Task<int> GetMatchedResultsCountByClient(string userId, DateTime startDate, DateTime endDate);
    }
}
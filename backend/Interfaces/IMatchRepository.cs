using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Match;
using backend.Models;

namespace backend.Interfaces
{
    public interface IMatchRepository
    {
        Task<Match> AddAsync(Match match);
        Task<Match> GetByMatchIdAsync(int matchId);
        Task<Match> UpdateMatchAsync(int matchId);
        Task<List<MatchWithResultsDto>> GetMatchWithResultsByClientId(string clientId);
    }
}
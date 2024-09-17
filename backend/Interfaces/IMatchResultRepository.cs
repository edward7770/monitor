using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;

namespace backend.Interfaces
{
    public interface IMatchResultRepository
    {
        Task<List<MatchResult>> AddAsync(List<MatchResult> matchResults);
        Task<MatchResult> UpdateAsync(int matchResultId);
    }
}
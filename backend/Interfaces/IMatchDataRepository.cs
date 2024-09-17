using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.MatchData;
using backend.Models;

namespace backend.Interfaces
{
    public interface IMatchDataRepository
    {
        Task<List<CreateMatchDataRequestDto>> AddAsync(List<CreateMatchDataRequestDto> createMatchDataRequestDtos);
        Task<List<MatchData>> GetLatestMatchDatasByIdNumber(string idNumber);
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Dtos.MatchData;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class MatchDataRepository : IMatchDataRepository
    {
        ApplicationDBContext _context;
        public MatchDataRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<List<CreateMatchDataRequestDto>> AddAsync(List<CreateMatchDataRequestDto> createMatchDataRequestDtos)
        {
            foreach (var createMatchData in createMatchDataRequestDtos)
            {
                var newMatchData = new MatchData
                {
                    MatchId = createMatchData.MatchId,
                    IdNumber = createMatchData.IdNumber,
                    OtherData = createMatchData.OtherData
                };

                await _context.MatchDatas.AddAsync(newMatchData);
            }

            await _context.SaveChangesAsync();

            return createMatchDataRequestDtos;
        }

        public async Task<List<MatchData>> GetLatestMatchDatasByIdNumber(string idNumber)
        {
            var latestMatchDatas = await _context.MatchDatas.Where(x => x.IdNumber == idNumber).ToListAsync();

            return latestMatchDatas;
        }
    }
}
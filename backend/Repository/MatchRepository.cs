using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Dtos.Match;
using backend.Dtos.MatchResult;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class MatchRepository : IMatchRepository
    {
        ApplicationDBContext _context;
        public MatchRepository(ApplicationDBContext context)
        {
            _context = context;
        }
        public async Task<Match> AddAsync(Match match)
        {
            await _context.Matches.AddAsync(match);
            await _context.SaveChangesAsync();

            return match;
        }

        public async Task<Match> GetByMatchIdAsync(int matchId)
        {
            return await _context.Matches.FindAsync(matchId);
        }

        public async Task<List<MatchWithResultsDto>> GetMatchWithResultsByClientId(string clientId)
        {
            var matchResults = await _context.Matches
                .Where(x => x.ClientId == clientId)
                .Include(s => s.MatchResult)
                .OrderByDescending(y => y.UploadDate)
                .Select(x => new MatchWithResultsDto
                {
                    Id = x.Id,
                    ClientId = x.ClientId,
                    Records = x.Records,
                    Status = x.Status,
                    FileName = x.FileName,
                    UploadedBy = x.UploadedBy,
                    UploadDate = x.UploadDate,
                    ProcessProgressRecords = x.ProcessProgressRecords,
                    ProcessingStartDate = x.ProcessingStartDate,
                    ProcessingEndedDate = x.ProcessingEndedDate,
                    MatchResults = x.MatchResult.Select(result => new MatchResultDto
                    {
                        Id = result.Id,
                        MatchId = result.MatchId,
                        IdNumber = result.IdNumber,
                        Type = result.Type,
                        RecordId = result.RecordId,
                        RawRecord = result.RawRecord,
                        DateMatched = result.DateMatched,
                        MatchedStep = result.MatchedStep,
                        DownloadDate = result.DownloadDate
                    }).ToList()
                })
                .ToListAsync();


            return matchResults;
        }

        public async Task<Match> UpdateMatchAsync(int matchId)
        {
            var matchRecord = await _context.Matches.FindAsync(matchId);

            if (matchRecord == null)
            {
                matchRecord.Status = "Failed";
            }
            else
            {
                matchRecord.Status = "Processed";
            }

            matchRecord.ProcessingEndedDate = DateTime.Now;

            await _context.SaveChangesAsync();

            return matchRecord;
        }

        public async Task<Match> UpdateProcessProgressAsync(int matchId, int count)
        {
            var match = await _context.Matches.FindAsync(matchId);

            match.ProcessProgressRecords = count;

            await _context.SaveChangesAsync();
            return match;
        }
    }
}
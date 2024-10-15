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

        public async Task<List<Match>> GetAllMatchesAsync()
        {
            var matches = await _context.Matches.ToListAsync();

            return matches;
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
                    J193MatchedCount = x.J193MatchedCount,
                    J187MatchedCount = x.J187MatchedCount,
                    Status = x.Status,
                    FileName = x.FileName,
                    UploadedBy = x.UploadedBy,
                    UploadDate = x.UploadDate,
                    ResultFileName = x.ResultFileName,
                    ProcessProgressRecords = x.ProcessProgressRecords,
                    ProcessingStartDate = x.ProcessingStartDate,
                    ProcessingEndedDate = x.ProcessingEndedDate,
                    ResultMonitorFiles = new List<ResultMonitorFileDto>()
                    // MatchResults = x.MatchResult.Select(result => new MatchResultDto
                    // {
                    //     Id = result.Id,
                    //     MatchId = result.MatchId,
                    //     IdNumber = result.IdNumber,
                    //     Type = result.Type,
                    //     RecordId = result.RecordId,
                    //     RawRecord = result.RawRecord,
                    //     DateMatched = result.DateMatched,
                    //     MatchedStep = result.MatchedStep,
                    //     DownloadDate = result.DownloadDate
                    // }).ToList()
                })
                .ToListAsync();

            foreach (var result in matchResults)
            {
                // Check if ResultFileName is not null or empty
                if (!string.IsNullOrEmpty(result.ResultFileName))
                {
                    // Split and trim the file names
                    var resultFileNames = result.ResultFileName.Split(',')
                        .Select(file => file.Trim()) // Trim any whitespace
                        .ToList();

                    // Initialize ResultMonitorFiles if it's null
                    result.ResultMonitorFiles = result.ResultMonitorFiles ?? new List<ResultMonitorFileDto>();

                    for (int index = 0; index < resultFileNames.Count; index++)
                    {
                        var file = resultFileNames[index];

                        // Fetch matched record based on MatchId and index
                        var matchedRecord = await _context.MatchResults
                            .FirstOrDefaultAsync(x => x.MatchId == result.Id && x.MatchedStep == index);

                        // Check if matchedRecord is not null before accessing its properties
                        if (matchedRecord != null)
                        {
                            DateTime? downloadDate = matchedRecord.DownloadDate == DateTime.MinValue ? (DateTime?)null : matchedRecord.DownloadDate;

                            result.ResultMonitorFiles.Add(new ResultMonitorFileDto
                            {
                                FileName = file,
                                DownloadDate = downloadDate
                            });
                        }
                        else
                        {
                            // Optionally handle the case where matchedRecord is null
                            // For example, you might want to log this or set a default DownloadDate
                            result.ResultMonitorFiles.Add(new ResultMonitorFileDto
                            {
                                FileName = file,
                                DownloadDate = null
                            });
                        }
                    }
                }
            }

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

        public async Task<Match> UpdateResultFileNameAsync(int matchId, string fileName)
        {
            var match = await _context.Matches.FindAsync(matchId);

            match.ResultFileName = match.ResultFileName + "," + fileName;

            await _context.SaveChangesAsync();

            return match;
        }
    }
}
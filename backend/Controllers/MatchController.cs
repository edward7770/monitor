using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Match;
using backend.Interfaces;
using backend.Models;
using backend.Repository;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/match")]
    [ApiController]
    public class MatchController : ControllerBase
    {
        readonly private IMatchRepository _matchRepo;

        public MatchController(IMatchRepository matchRepo)
        {
            _matchRepo = matchRepo;
        }

        [HttpPost("create")]
        public async Task<IActionResult> addMatchRecord([FromBody] CreateMatchRequestDto createMatchRequestDto)
        {
            var newMatchRecord = new Match {
                ClientId = createMatchRequestDto.ClientId,
                Records = createMatchRequestDto.Records,
                Matched = "",
                Status = "Processing",
                FileName = createMatchRequestDto.FileName,
                UploadedBy = createMatchRequestDto.UploadedBy,
                UploadDate = DateTime.Now,
                ProcessingStartDate = DateTime.Now,
                ProcessingEndedDate = DateTime.Now
            };

            var match = await _matchRepo.AddAsync(newMatchRecord);

            if(match == null)
            {
                return StatusCode(403, "Failed to store match record");
            }

            return Ok(match);
        }

        [HttpGet("{clientId}")]
        public async Task<IActionResult> GetMatchWithResults(string clientId)
        {
            var matchResults = await _matchRepo.GetMatchWithResultsByClientId(clientId);

            if(matchResults == null)
            {
                return StatusCode(403, "Failed to get match results");
            }

            return Ok(matchResults);
        }
    }
}
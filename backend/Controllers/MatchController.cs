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
        readonly private IWebHostEnvironment _hostEnvironment;

        public MatchController(IMatchRepository matchRepo, IWebHostEnvironment hostEnvironment)
        {
            _matchRepo = matchRepo;
            _hostEnvironment = hostEnvironment;
        }

        [HttpPost("create")]
        public async Task<IActionResult> addMatchRecord([FromForm] CreateMatchRequestDto createMatchRequestDto)
        {
            string uniqueFileName = "";

            List<string> validExtensions = new List<string>() {".csv"};
            if(createMatchRequestDto.UploadedFile.Length > 0)
            {
                string fileExtenstion = Path.GetExtension(createMatchRequestDto.UploadedFile.FileName);
                if(!validExtensions.Contains(fileExtenstion))
                {
                    return StatusCode(StatusCodes.Status409Conflict, "Extension is not valid");
                }

                string uploadedFileName = Guid.NewGuid().ToString() + fileExtenstion;
                var filePath = Path.Combine(_hostEnvironment.ContentRootPath, "Uploads", "UploadedFiles");
                var fileStream = new FileStream(filePath + "\\" + uploadedFileName, FileMode.Create);
                uniqueFileName = uploadedFileName;

                await createMatchRequestDto.UploadedFile.CopyToAsync(fileStream);
            }

            var newMatchRecord = new Match {
                ClientId = createMatchRequestDto.ClientId,
                Records = createMatchRequestDto.Records,
                Status = "Processing",
                FileName = createMatchRequestDto.FileName,
                UniqueFileName = uniqueFileName,
                UploadedBy = createMatchRequestDto.UploadedBy,
                UploadDate = DateTime.Now,
                ProcessingStartDate = DateTime.Now,
                ProcessingEndedDate = null
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
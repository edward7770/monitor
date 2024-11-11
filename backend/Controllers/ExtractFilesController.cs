using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Interfaces;
using backend.Service;
using Hangfire;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/extract")]
    [ApiController]
    public class ExtractFilesController : ControllerBase
    {
        private readonly ExtractFilesService _extractFilesService;
        private readonly IExtractHistoryRepository _extractHistoryRepo;
        public ExtractFilesController(ExtractFilesService extractFilesService, IExtractHistoryRepository extractHistoryRepo)
        {
            _extractFilesService = extractFilesService;
            _extractHistoryRepo = extractHistoryRepo;
        }
        
        [HttpGet]
        public async Task<IActionResult> ExtractFiles([FromQuery] string userId = "")
        {
            BackgroundJob.Enqueue(() => _extractFilesService.ExtractRecordsFromFiles("User", userId));

            return Ok("success");
        }

        [HttpGet("history")]
        public async Task<IActionResult> GetAllExtractHistory()
        {
            var histories = await _extractHistoryRepo.GetExtractHistories();

            return Ok(histories);
        }
    }
}
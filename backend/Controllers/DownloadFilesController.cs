using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Hangfire;
using backend.Interfaces;

namespace backend.Controllers
{
    [Route("api/download")]
    [ApiController]
    public class DownloadFilesController : ControllerBase
    {
        private readonly SharePointFileDownloaderService _fileDownloaderService;
        private readonly IDownloadHistoryRepository _downloadHistoryRepo;
        public DownloadFilesController(SharePointFileDownloaderService fileDownloaderService, IDownloadHistoryRepository downloadHistoryRepo)
        {
            _fileDownloaderService = fileDownloaderService;
            _downloadHistoryRepo = downloadHistoryRepo;
        }

        [HttpGet]
        public async Task<IActionResult> DownloadFiles([FromQuery] string userId = "")
        {
            BackgroundJob.Enqueue(() => _fileDownloaderService.DownloadFilesAsync("User", userId));

            return Ok("success");
        }

        [HttpGet("history")]
        public async Task<IActionResult> GetAllDownloadHistory()
        {
            var histories = await _downloadHistoryRepo.GetDownloadHistories();

            return Ok(histories);
        }
    }
}
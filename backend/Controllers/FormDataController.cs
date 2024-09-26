using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.SearchLog;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/data")]
    [ApiController]
    public class FormDataController : ControllerBase
    {
        readonly private IFormDataRepository _formDataRepo;
        readonly private ISearchLogRepository _searchLogRepo;

        public FormDataController(IFormDataRepository formDataRepo, ISearchLogRepository searchLogRepo)
        {
            _formDataRepo = formDataRepo;
            _searchLogRepo = searchLogRepo;
        }

        [HttpGet("form187")]
        public async Task<IActionResult> GetAllForm187(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string sortColumn = "DateCreated",
            [FromQuery] string sortDirection = "asc",
            [FromQuery] string search = "")

        {
            var form187Records = await _formDataRepo.GetAllForm187Async(page, pageSize, sortColumn, sortDirection, search);

            return Ok(form187Records);
        }

        [HttpGet("form193")]
        public async Task<IActionResult> GetAllForm193(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string sortColumn = "DateCreated",
            [FromQuery] string sortDirection = "asc",
            [FromQuery] string search = "")
        {
            var form193Records = await _formDataRepo.GetAllForm193Async(page, pageSize, sortColumn, sortDirection, search);

            return Ok(form193Records);
        }

        [HttpGet("form187/{recordId}")]
        public async Task<IActionResult> GetForm187Record(Guid recordId)
        {
            var form187Record = await _formDataRepo.GetForm187ByRecordIdAsync(recordId);

            return Ok(form187Record);
        }

        [HttpGet("form193/{recordId}")]
        public async Task<IActionResult> GetForm193Record(Guid recordId)
        {
            var form193Record = await _formDataRepo.GetForm193ByRecordIdAsync(recordId);

            return Ok(form193Record);
        }

        [HttpPost("searchLog")]
        public async Task<IActionResult> Create([FromBody] CreateSearchLogRequestDto createSearchLogRequestDto)
        {
            var newSearchLog = new SearchLog {
                UserId = createSearchLogRequestDto.UserId,
                SearchString = createSearchLogRequestDto.SearchString,
                Date = DateTime.Now,
            };

            var searchLog = await _searchLogRepo.AddAsync(newSearchLog);

            if(searchLog == null)
            {
                return StatusCode(403, "Failed to store search log.");
            }

            return Ok(searchLog);
        }

        [HttpGet("searchLog")]
        public async Task<IActionResult> GetAll()
        {
            var clientsWithSearchLogs = await _searchLogRepo.GetAllAsync();

            if(clientsWithSearchLogs == null)
            {
                return StatusCode(403, "Failed to fetch search logs.");
            }

            return Ok(clientsWithSearchLogs);
        }
    }
}
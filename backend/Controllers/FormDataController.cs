using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/data")]
    [ApiController]
    public class FormDataController : ControllerBase
    {
        readonly private IFormDataRepository _formDataRepo;

        public FormDataController(IFormDataRepository formDataRepo)
        {
            _formDataRepo = formDataRepo;
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
    }
}
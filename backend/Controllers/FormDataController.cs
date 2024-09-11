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
        public async Task<IActionResult> GetAllForm187()
        {
            var form187Records = await _formDataRepo.GetAllForm187Async();

            return Ok(form187Records);
        }

        [HttpGet("form193")]
        public async Task<IActionResult> GetAllForm193()
        {
            var form193Records = await _formDataRepo.GetAllForm193Async();

            return Ok(form193Records);
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/district")]
    [ApiController]
    public class DistrictController : ControllerBase
    {
        readonly private IDistrictRepository _districtRepo;
        public DistrictController(IDistrictRepository districtRepo)
        {
            _districtRepo = districtRepo;
        }

        [HttpGet("{provinceId}")]
        public async Task<IActionResult> GetAll(int provinceId)
        {
            var districts = await _districtRepo.GetAllAsync(provinceId);
            return Ok(districts);
        }
    }
}
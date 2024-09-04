using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/province")]
    [ApiController]
    public class ProvinceController : ControllerBase
    {
        readonly private IProvinceRepository _provinceRepo;
        public ProvinceController(IProvinceRepository provinceRepo)
        {
            _provinceRepo = provinceRepo;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var provinces = await _provinceRepo.GetAllAsync();
            return Ok(provinces);
        }
    }
}
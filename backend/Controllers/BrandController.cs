using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Brand;
using backend.Interfaces;
using backend.Models;
using backend.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/brand")]
    [ApiController]
    public class BrandController : ControllerBase
    {
        IBrandRepository _brandRepo;
        public BrandController(IBrandRepository brandRepo)
        {
            _brandRepo = brandRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var brandModels = await _brandRepo.GetAllAsync();

            return Ok(brandModels);
        }

        [HttpPost("create")]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreateBrandRequestDto brandDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var brand = await _brandRepo.GetByNameAsync(brandDto.Name, brandDto.Type);

            if (brand != null)
            {
                return StatusCode(500, "brand_exist_msg");
            }

            var newBrand = new Brand
            {
                Name = brandDto.Name,
                Type = brandDto.Type,
                CreatedByUserId = brandDto.UserId,
                Status = 0,
                DateCreated = DateTime.Now
            };

            if (brandDto.Role != "Supplier")
            {
                newBrand.ApprovedByUserId = brandDto.UserId;
                newBrand.DateApproved = DateTime.Now;
                newBrand.Status = 1;
            }

            var savedBrand = await _brandRepo.AddAsync(newBrand);

            if (savedBrand == null)
            {
                return StatusCode(500, "save_brand_fail_msg");
            }

            return Ok(savedBrand);
        }

        [HttpPost("status/{brandId}")]
        [Authorize]
        public async Task<IActionResult> UpdateStatus(int brandId, [FromBody] UpdateBrandStatusRequestDto statusDto)
        {
            var brand = await _brandRepo.UpdateStatusAsync(brandId, statusDto);

            if(brand != null){
                return Ok(brand);
            }else{
                return StatusCode(500, "save_brand_fail_msg");
            }
        }
    }
}
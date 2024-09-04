using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Solution;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/solution")]
    [ApiController]
    public class SolutionController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ISolutionRepository _solutionRepo;
        private readonly ISolutionDetailRepository _solutionDetailRepo;
        private readonly ISolutionProvinceRepository _solutionProvinceRepo;
        private readonly ISupplierRepository _supplierRepo;
        public SolutionController(UserManager<AppUser> userManager, ISolutionRepository solutionRepo, ISolutionDetailRepository solutionDetailRepo, ISupplierRepository supplierRepo, ISolutionProvinceRepository solutionProvinceRepo)
        {
            _userManager = userManager;
            _solutionRepo = solutionRepo;
            _solutionDetailRepo = solutionDetailRepo;
            _solutionProvinceRepo = solutionProvinceRepo;
            _supplierRepo = supplierRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var solutions = await _solutionRepo.GetAllAsync();
            return Ok(solutions);
        }

        [HttpPost("create")]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreateSolutionRequestDto solutionDto) 
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var solution = await _solutionRepo.GetByNameAsync(solutionDto.Name);

            if(solution != null)
            {
                return BadRequest("solution_exist_msg");
            }

            var appUser = _userManager.Users.FirstOrDefault(x => x.Email == solutionDto.CreatedByEmail);
            if(appUser == null) 
            {
                return BadRequest("invalid_user_msg");
            }

            var supplierId = solutionDto.SupplierId;
            var createdByUserId = appUser.Id;
            
            if(supplierId == 0)
            {
                var supplier = await _supplierRepo.GetByUserIdAsync(appUser.Id);
                supplierId = supplier.Id;
            } 
            else {
                var supplier = await _supplierRepo.GetBySupplierIdAsync(supplierId);
                createdByUserId = supplier.UserId;
            }

            var newSolution = new Solution {
                Name = solutionDto.Name,
                Description = solutionDto.Description,
                Price = solutionDto.Price,
                EquipmentPrice = solutionDto.EquipmentPrice,
                CreatedByUserId = createdByUserId,
                SupplierId = supplierId,
                Status = 0,
                ApprovedByUserId = ""
            };

            var savedSolution = await _solutionRepo.AddAsync(newSolution);

            if(savedSolution == null)
            {
                return StatusCode(500, "save_solution_fail_msg");
            }

            var newSolutionDetail = new SolutionDetail {
                SolutionId = savedSolution.Id,
                InverterId = solutionDto.InverterId,
                PanelId = solutionDto.PanelId,
                PanelCount = solutionDto.PanelCount,
                StorageId = solutionDto.StorageId,
                StorageCount = solutionDto.StorageCount,
                StringCount = solutionDto.StringCount,
            };

            var savedSolutionDetail = await _solutionDetailRepo.AddAsync(newSolutionDetail);

            if(savedSolutionDetail == null)
            {
                return StatusCode(500, "save_solution_detail_fail_msg");
            }

            var savedSolutionProvince = await _solutionProvinceRepo.AddAsync(solutionDto.Provinces, savedSolution.Id);

            if(savedSolutionProvince == null)
            {
                return StatusCode(500, "save solution provinces was failed!");
            }

            return Ok(savedSolution);
        }

        [HttpPost("edit/{solutionId}")]
        [Authorize]
        public async Task<IActionResult> UpdateSolution(int solutionId, [FromBody] UpdateSolutionRequestDto solutionDto)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var updatedSolution = await _solutionRepo.UpdateSolutionAsync(solutionId, solutionDto);

            if(updatedSolution == null) 
            {
                return BadRequest("solution_no_exist_msg");
            }

            var updatedSolutionDetail = await _solutionDetailRepo.UpdateAsync(updatedSolution.Id, solutionDto);

            if(updatedSolutionDetail == null) 
            {
                return BadRequest("solution_no_exist_msg");
            }

            var updateSolutionProvince = await _solutionProvinceRepo.UpdateAsync(solutionDto.Provinces, updatedSolution.Id);

            if(updateSolutionProvince == null)
            {
                return StatusCode(500, "save solution provinces was failed!");
            }

            return Ok(updatedSolution);

        }

        [HttpPost("switchstatus/{solutionId}")]
        [Authorize]
        public async Task<IActionResult> UpdateSolutionStatus(int solutionId, [FromBody] UpdateSolutionStatusRequestDto statusDto)
        {
            var savedSolution = await _solutionRepo.UpdateStatusAsync(solutionId, statusDto);

            if(savedSolution != null){
                return Ok(savedSolution);
            }else{
                return BadRequest("solution_no_exist_msg");
            }
        }

    }
}
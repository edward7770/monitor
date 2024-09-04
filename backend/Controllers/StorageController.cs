using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Storage;
using backend.Interfaces;
using backend.Models;
using backend.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/storage")]
    [ApiController]
    public class StorageController : ControllerBase
    {

        private readonly IStorageRepository _storageRepo;
        private readonly IDocumentationRepository _documentationRepo;
        private readonly IWebHostEnvironment _hostEnvironment;
        public StorageController(IStorageRepository storageRepo, IDocumentationRepository documentationRepo, IWebHostEnvironment hostEnvironment)
        {
            _storageRepo = storageRepo;
            _documentationRepo = documentationRepo;
            _hostEnvironment = hostEnvironment;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var storageModels = await _storageRepo.GetAllAsync();

            // var storageDto = storageModels.Select(x => x.ToStorageDto());

            return Ok(storageModels);
        }

        [HttpPost("create")]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreateStorageRequestDto storageDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var storage = await _storageRepo.GetByNameAsync(storageDto.ModelNumber);

            if (storage != null)
            {
                return StatusCode(500, "storage_exist_msg");
            }

            var newStorage = new Storage
            {
                BrandId = storageDto.BrandId,
                ModelNumber = storageDto.ModelNumber,
                Watts = storageDto.Watts,
                Volts = storageDto.Volts,
                Amps = storageDto.Amps,
                MaxChargingVoltage = storageDto.MaxChargingVoltage,
                FloatChargingVoltage = storageDto.FloatChargingVoltage,
                MaxChargeAmps = storageDto.MaxChargeAmps,
                Weight = storageDto.Weight,
                CreatedByUserId = storageDto.UserId,
                Status = 0,
                DateCreated = DateTime.Now
            };

            if (storageDto.Role != "Supplier")
            {
                newStorage.ApprovedByUserId = storageDto.UserId;
                newStorage.DateApproved = DateTime.Now;
                newStorage.Status = 1;
            }

            var savedStorage = await _storageRepo.AddAsync(newStorage);

            if (savedStorage == null)
            {
                return StatusCode(500, "save_storage_fail_msg");
            }

            return Ok(savedStorage);
        }

        [HttpPost("update/{editId}")]
        [Authorize]
        public async Task<IActionResult> Update(int editId, [FromBody] StorageDto storageDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var findStorage = await _storageRepo.GetByNameAsync(storageDto.ModelNumber);

            if (findStorage != null && findStorage.Id != storageDto.Id)
            {
                return StatusCode(500, "model_number_exist_msg");
            }

            var updatedStorage = await _storageRepo.UpdateAsync(editId, storageDto);

            if (updatedStorage == null)
            {
                return StatusCode(500, "storage_no_exist_msg");
            }

            return Ok(updatedStorage);
        }


        [HttpPost("fileupload")]
        [Authorize]
        public async Task<IActionResult> Upload(IEnumerable<IFormFile> files)
        {
            foreach (var file in files)
            {
                if (file.Length > 0)
                {
                    var defaultFile = Path.GetFileNameWithoutExtension(file.FileName);
                    List<string> validExtensions = new List<string>() { ".pdf", ".doc", ".docx" };

                    var deviceId = Convert.ToInt32(HttpContext.Request.Form["deviceId"]);
                    var userId = HttpContext.Request.Form["userId"];

                    string extenstion = Path.GetExtension(file.FileName);
                    if (!validExtensions.Contains(extenstion))
                    {
                        return StatusCode(StatusCodes.Status409Conflict, "Extension is not valid");
                    }

                    string fileName = Guid.NewGuid().ToString() + extenstion;
                    var filePath = Path.Combine(_hostEnvironment.ContentRootPath, "Uploads", "Storage");
                    var stream = new FileStream(filePath + "\\" + fileName, FileMode.Create);
                    await file.CopyToAsync(stream);

                    var documentation = new Documentation
                    {
                        Type = "storage",
                        Name = defaultFile,
                        File = "Storage/" + fileName,
                        DeviceId = deviceId,
                        DateCreated = DateTime.Now,
                        CreatedByUserId = userId,
                    };

                    await _documentationRepo.AddDocAsync(documentation);
                }

            }

            return Ok("upload_doc_success_msg");
        }

        [HttpPost("status/{storageId}")]
        [Authorize]
        public async Task<IActionResult> UpdateStatus(int storageId, [FromBody] UpdateStorageRequestDto statusDto)
        {
            var storage = await _storageRepo.UpdateStatusAsync(storageId, statusDto);

            if (storage != null)
            {
                return Ok(storage);
            }
            else
            {
                return StatusCode(500, "save_storage_fail_msg");
            }
        }
    }
}
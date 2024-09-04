using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Inverter;
using backend.Interfaces;
using backend.Models;
using backend.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Formats.Asn1;

namespace backend.Controllers
{
    [Route("api/inverter")]
    [ApiController]
    public class InverterController : ControllerBase
    {
        IInverterRepository _inverterRepo;
        IDocumentationRepository _documentationRepo;
        private readonly IWebHostEnvironment _hostEnvironment;
        public InverterController(IInverterRepository inverterRepo, IDocumentationRepository documentationRepo, IWebHostEnvironment hostEnvironment)
        {
            _inverterRepo = inverterRepo;
            _documentationRepo = documentationRepo;
            _hostEnvironment = hostEnvironment;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() 
        {
            var inverterModels = await _inverterRepo.GetAllAsync();

            return Ok(inverterModels);
        }

        [HttpPost("create")]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreateInverterRequestDto inverterDto)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var inverter = await _inverterRepo.GetByNameAsync(inverterDto.ModelNumber);

            if(inverter != null)
            {
                return StatusCode(500, "inverter_exist_msg");
            }

            var newInverter = new Inverter {
                BrandId = inverterDto.BrandId,
                ModelNumber = inverterDto.ModelNumber,
                Volts = inverterDto.Volts,
                KVA = inverterDto.KVA,
                Voc = inverterDto.Voc,
                MaxMPPTVolts = inverterDto.MaxMPPTVolts,
                MaxMPPTWatts = inverterDto.MaxMPPTWatts,
                MaxMPPTAmps = inverterDto.MaxMPPTAmps,
                Strings = inverterDto.Strings,
                PhaseCount = inverterDto.PhaseCount,
                PVOperatingVoltageRange = inverterDto.PVOperatingVoltageRange,
                Efficiency = inverterDto.Efficiency,
                CreatedByUserId = inverterDto.UserId,
                Status = 0,
                DateCreated = DateTime.Now
            };

            if (inverterDto.Role != "Supplier")
            {
                newInverter.ApprovedByUserId = inverterDto.UserId;
                newInverter.DateApproved = DateTime.Now;
                newInverter.Status = 1;
            }

            var savedInverter = await _inverterRepo.AddAsync(newInverter);

            if(savedInverter == null)
            {
                return StatusCode(500, "save_inverter_fail_msg");
            }

            return Ok(savedInverter);
        }

        [HttpPost("update/{editId}")]
        [Authorize]
        public async Task<IActionResult> Update(int editId, [FromBody] InverterDto inverterDto)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var fineInverter = await _inverterRepo.GetByNameAsync(inverterDto.ModelNumber);

            if(fineInverter != null && fineInverter.Id != inverterDto.Id) {
                return StatusCode(500, "model_number_exist_msg");
            }

            var updatedInverter = await _inverterRepo.UpdateAsync(editId, inverterDto);

            if(updatedInverter == null)
            {
                return StatusCode(500, "inverter_no_exist_msg");
            }

            return Ok(updatedInverter);
        }

        [HttpPost("fileupload")]
        [Authorize]
        public async Task<IActionResult> Upload(IEnumerable<IFormFile> files)
        {
            foreach(var file in files)
            {
                if(file.Length > 0)
                {
                    var defaultFile = Path.GetFileNameWithoutExtension(file.FileName);
                    List<string> validExtensions = new List<string>() {".pdf", ".doc", ".docx"};

                    var deviceId = Convert.ToInt32(HttpContext.Request.Form["deviceId"]);
                    var userId = HttpContext.Request.Form["userId"];

                    string extenstion = Path.GetExtension(file.FileName);
                    if(!validExtensions.Contains(extenstion))
                    {
                        return StatusCode(StatusCodes.Status409Conflict, "Extension is not valid");
                    }

                    string fileName = Guid.NewGuid().ToString() + extenstion;
                    var filePath = Path.Combine(_hostEnvironment.ContentRootPath, "Uploads", "Inverter");
                    var stream = new FileStream(filePath + "\\" + fileName, FileMode.Create);
                    await file.CopyToAsync(stream);

                    var documentation = new Documentation {
                        Type = "inverter",
                        Name = defaultFile,
                        File = "Inverter/" + fileName,
                        DeviceId = deviceId,
                        DateCreated = DateTime.Now,
                        CreatedByUserId = userId,
                    };

                    await _documentationRepo.AddDocAsync(documentation);
                }

            }

            return Ok("upload_doc_success_msg");
        }

        [HttpPost("status/{inverterId}")]
        [Authorize]
        public async Task<IActionResult> UpdateStatus(int inverterId, [FromBody] UpdateInverterStatusRequestDto statusDto)
        {
            var inverter = await _inverterRepo.UpdateStatusAsync(inverterId, statusDto);

            if(inverter != null){
                return Ok(inverter);
            }else{
                return StatusCode(500, "save_inverter_fail_msg");
            }
        }
    }
}
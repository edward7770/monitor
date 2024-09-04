using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Panel;
using backend.Interfaces;
using backend.Models;
using backend.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/panel")]
    [ApiController]
    public class PanelController : ControllerBase
    {
        readonly private IPanelRepository _panelRepo;
        readonly private IDocumentationRepository _documentationRepo;
        private readonly IWebHostEnvironment _hostEnvironment;
        public PanelController(IPanelRepository panelRepo, IDocumentationRepository documentationRepo, IWebHostEnvironment hostEnvironment)
        {
            _panelRepo = panelRepo;
            _documentationRepo = documentationRepo;
            _hostEnvironment = hostEnvironment;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var panelModels = await _panelRepo.GetAllAsync();
            // var panelDto = panelModels.Select(s => s.ToPanelDto()).ToList();
            return Ok(panelModels);
        }

        [HttpPost("create")]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreatePanelRequestDto panelDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var panel = await _panelRepo.GetByNameAsync(panelDto.ModelNumber);

            if (panel != null)
            {
                return StatusCode(500, "panel_exist_msg");
            }

            var newPanel = new Panel
            {
                BrandId = panelDto.BrandId,
                ModelNumber = panelDto.ModelNumber,
                Watts = panelDto.Watts,
                Voc = panelDto.Voc,
                Amps = panelDto.Amps,
                Width = panelDto.Width,
                Height = panelDto.Height,
                Depth = panelDto.Depth,
                Weight = panelDto.Weight,
                Color = panelDto.Color,
                FrameColor = panelDto.FrameColor,
                Connectors = panelDto.Connectors,
                Type = panelDto.Type,
                Technology = panelDto.Technology,
                Efficiency = panelDto.Efficiency,
                CreatedByUserId = panelDto.UserId,
                Status = 0,
                DateCreated = DateTime.Now
            };

            if (panelDto.Role != "Supplier")
            {
                newPanel.ApprovedByUserId = panelDto.UserId;
                newPanel.DateApproved = DateTime.Now;
                newPanel.Status = 1;
            }

            var savedPanel = await _panelRepo.AddAsync(newPanel);

            if (savedPanel == null)
            {
                return StatusCode(500, "save_panel_fail_msg");
            }

            return Ok(savedPanel);
        }

        [HttpPost("update/{editId}")]
        [Authorize]
        public async Task<IActionResult> Update(int editId, [FromBody] PanelDto panelDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var updatedPanel = await _panelRepo.UpdateAsync(editId, panelDto);

            var finePanel = await _panelRepo.GetByNameAsync(panelDto.ModelNumber);

            if (finePanel != null && finePanel.Id != panelDto.Id)
            {
                return StatusCode(500, "model_number_exist_msg");
            }

            if (updatedPanel == null)
            {
                return StatusCode(500, "panel_no_exist_msg");
            }

            return Ok(updatedPanel);
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
                    var filePath = Path.Combine(_hostEnvironment.ContentRootPath, "Uploads", "Panel");
                    var stream = new FileStream(filePath + "\\" + fileName, FileMode.Create);
                    await file.CopyToAsync(stream);

                    var documentation = new Documentation
                    {
                        Type = "panel",
                        Name = defaultFile,
                        File = "Panel/" + fileName,
                        DeviceId = deviceId,
                        DateCreated = DateTime.Now,
                        CreatedByUserId = userId,
                    };

                    await _documentationRepo.AddDocAsync(documentation);
                }

            }

            return Ok("upload_doc_success_msg");
        }

        [HttpPost("status/{panelId}")]
        [Authorize]
        public async Task<IActionResult> UpdateStatus(int panelId, [FromBody] UpdatePanelStatusRequestDto statusDto)
        {
            var panel = await _panelRepo.UpdateStatusAsync(panelId, statusDto);

            if (panel != null)
            {
                return Ok(panel);
            }
            else
            {
                return StatusCode(500, "save_panel_fail_msg");
            }
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/upload")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        IUploadRepository _uploadRepo;
        private readonly IWebHostEnvironment _hostEnvironment;
        public UploadController(IUploadRepository uploadRepo, IWebHostEnvironment hostEnvironment)
        {
            _uploadRepo = uploadRepo;
            _hostEnvironment = hostEnvironment;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create(IFormFile file)
        {
            if(file.Length > 0)
            {
                var defaultFile = Path.GetFileNameWithoutExtension(file.FileName);
                List<string> validExtensions = new List<string>() {".pdf", ".doc", ".docx"};

                var deviceId = Convert.ToInt32(HttpContext.Request.Form["deviceId"]);
                string deviceType = HttpContext.Request.Form["deviceType"];
                string capitalDeviceType = deviceType.Substring(0, 1).ToUpper() + deviceType.Substring(1);
                var userId = HttpContext.Request.Form["userId"];

                string extenstion = Path.GetExtension(file.FileName);
                if(!validExtensions.Contains(extenstion))
                {
                    return StatusCode(StatusCodes.Status409Conflict, "Extension is not valid");
                }

                string fileName = Guid.NewGuid().ToString() + extenstion;
                var filePath = Path.Combine(_hostEnvironment.ContentRootPath, "Uploads", capitalDeviceType);
                var stream = new FileStream(filePath + "\\" + fileName, FileMode.Create);
                await file.CopyToAsync(stream);

                var documentation = new Documentation {
                    Type = deviceType,
                    Name = defaultFile,
                    File = capitalDeviceType + "/" + fileName,
                    DeviceId = deviceId,
                    DateCreated = DateTime.Now,
                    CreatedByUserId = userId,
                };

                await _uploadRepo.AddAsync(documentation);

                return Ok(documentation);
            }
            return BadRequest("select_doc_msg");
        }

        [HttpPost("supplier")]
        [Authorize]
        public async Task<IActionResult> Supplier(IFormFile file)
        {
            var fileType = HttpContext.Request.Form["fileType"];
            List<string> validExtensions = new List<string>() {".pdf", ".doc", ".docx"};
            if(file.Length > 0)
            {
                string docExtenstion = Path.GetExtension(file.FileName);
                if(!validExtensions.Contains(docExtenstion))
                {
                    return StatusCode(StatusCodes.Status409Conflict, "Extension is not valid");
                }

                string fileName = Guid.NewGuid().ToString() + docExtenstion;
                var filePath = Path.Combine(_hostEnvironment.ContentRootPath, "Uploads", fileType);
                var stream = new FileStream(filePath + "\\" + fileName, FileMode.Create);
                var fileFullPath = fileType + "/" + fileName;

                await file.CopyToAsync(stream);

                return Ok(fileFullPath);
            }
            return BadRequest("select_doc_msg");
        }



        [HttpGet("preview/{fileName}")]
        public IActionResult PreviewDoc(string fileName)
        {
            var uploadFolderPath = Path.Combine(_hostEnvironment.ContentRootPath, "Uploads", "CompanyRegistrationDoc");
            var filePath = Path.Combine(uploadFolderPath, fileName);
            string contentType;

            // Determine content type based on file extension
            string extension = Path.GetExtension(fileName)?.ToLower();
            switch (extension)
            {
                case ".pdf":
                    contentType = "application/pdf";
                    break;
                case ".doc":
                    contentType = "application/msword";
                    break;
                case ".docx":
                    contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                    break;
                default:
                    return NotFound(); // Unsupported file type
            }

            // Set content type header
            Response.ContentType = contentType;

            // Set content disposition to inline to preview in browser
            Response.Headers.Append("Content-Disposition", "inline");

            // Return the file as FileContentResult
            byte[] fileBytes = System.IO.File.ReadAllBytes(filePath);
            return File(fileBytes, contentType, fileName);
        }

        [HttpDelete("{docId}")]
        [Authorize]
        public async Task<IActionResult> RemoveDocumentation(int docId)
        {
            var documentation = await _uploadRepo.RemoveAsync(docId);
            return Ok(documentation);
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/documentation")]
    [ApiController]
    public class DocumentationController : ControllerBase
    {
        IDocumentationRepository _documentationRepo;
        public DocumentationController(IDocumentationRepository documentationRepo)
        {
            _documentationRepo = documentationRepo;
        }
        
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var documentationmModels = await _documentationRepo.GetAllAsync();
            return Ok(documentationmModels);
        }
    }
}
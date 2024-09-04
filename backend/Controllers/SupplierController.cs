using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Supplier;
using backend.Interfaces;
using backend.Models;
using backend.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Dtos.SupplierUser;

namespace backend.Controllers
{
    [Route("api/supplier")]
    [ApiController]
    public class SupplierController : ControllerBase
    {
        readonly private ISupplierRepository _supplierRepo;
        readonly private ISupplierUserRepository _supplierUserRepo;
        private readonly IWebHostEnvironment _hostEnvironment;
        public SupplierController(ISupplierRepository supplierRepo, ISupplierUserRepository supplierUserRepo,  IWebHostEnvironment hostEnvironment)
        {
            _supplierRepo = supplierRepo;
            _supplierUserRepo = supplierUserRepo;
            _hostEnvironment = hostEnvironment;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var supplierModels = await _supplierRepo.GetAllAsync();

            return Ok(supplierModels);
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromForm] CreateSupplierRequestDto supplierDto)
        {
            string registraionDocName = "";
            string tradeLicenceDocName = "";
            string governmentLicenceDocName = "";

            List<string> validExtensions = new List<string>() {".pdf", ".doc", ".docx"};
            if(supplierDto.CompanyRegistrationDoc.Length > 0)
            {
                string registrationExtenstion = Path.GetExtension(supplierDto.CompanyRegistrationDoc.FileName);
                if(!validExtensions.Contains(registrationExtenstion))
                {
                    return StatusCode(StatusCodes.Status409Conflict, "Extension is not valid");
                }

                string registrationFileName = Guid.NewGuid().ToString() + registrationExtenstion;
                var registrationFilePath = Path.Combine(_hostEnvironment.ContentRootPath, "Uploads", "CompanyRegistrationDoc");
                var registrationStream = new FileStream(registrationFilePath + "\\" + registrationFileName, FileMode.Create);
                registraionDocName = "CompanyRegistrationDoc/" + registrationFileName;

                await supplierDto.CompanyRegistrationDoc.CopyToAsync(registrationStream);
            }

            if(supplierDto.TradeLicenceDoc.Length > 0)
            {
                string tradeExtenstion = Path.GetExtension(supplierDto.TradeLicenceDoc.FileName);
                if(!validExtensions.Contains(tradeExtenstion))
                {
                    return StatusCode(StatusCodes.Status409Conflict, "Extension is not valid");
                }

                string tradeFileName = Guid.NewGuid().ToString() + tradeExtenstion;
                var tradeFilePath = Path.Combine(_hostEnvironment.ContentRootPath, "Uploads", "TradeLicenceDoc");
                var tradeStream = new FileStream(tradeFilePath + "\\" + tradeFileName, FileMode.Create);
                tradeLicenceDocName = "TradeLicenceDoc/" + tradeFileName;

                await supplierDto.TradeLicenceDoc.CopyToAsync(tradeStream);
            }

            if(supplierDto.GovernmentLicenceDoc.Length > 0)
            {
                string governmentExtenstion = Path.GetExtension(supplierDto.GovernmentLicenceDoc.FileName);
                if(!validExtensions.Contains(governmentExtenstion))
                {
                    return StatusCode(StatusCodes.Status409Conflict, "Extension is not valid");
                }

                string governementFileName = Guid.NewGuid().ToString() + governmentExtenstion;
                var governmentFilePath = Path.Combine(_hostEnvironment.ContentRootPath, "Uploads", "GovernmentLicenceDoc");
                var governmentStream = new FileStream(governmentFilePath + "\\" + governementFileName, FileMode.Create);
                governmentLicenceDocName = "GovernmentLicenceDoc/" + governementFileName;

                await supplierDto.GovernmentLicenceDoc.CopyToAsync(governmentStream);
            }

            var newSupplier = new Supplier{
                Name = supplierDto.Name,
                Surname = supplierDto.Surname,
                CompanyName = supplierDto.CompanyName,
                RegistrationNumber = supplierDto.RegistrationNumber,
                ContactEmail = supplierDto.ContactEmail,
                Phone = supplierDto.Phone,
                Mobile = supplierDto.Mobile,
                AddressLine1 = supplierDto.AddressLine1,
                AddressLine2 = supplierDto.AddressLine2,
                AddressLine3 = supplierDto.AddressLine3,
                AddressLine4 = supplierDto.AddressLine4,
                AddressPostalCode = supplierDto.AddressPostalCode,
                CompanyRegistrationDoc = registraionDocName,
                TradeLicenceDoc = tradeLicenceDocName,
                GovernmentLicenceDoc = governmentLicenceDocName,
                DateCreated = DateTime.Now,
                UserId = supplierDto.UserId,
            };

            var supplier = await _supplierRepo.AddAsync(newSupplier);
            if(supplier == null)
            {
                return BadRequest("register_supplier_fail_msg");
            }

            var newSupplierUser = new SupplierUser{
                SupplierId = supplier.Id,
                UserId = supplier.UserId,
            };

            var supplierUser = await _supplierUserRepo.AddSupplierUserAsync(newSupplierUser);

            if(supplierUser == null)
            {
                return BadRequest("register_supplieruser_fail_msg");
            }

            return Ok(supplier);
        }

        [HttpPost("update/{supplierId}")]
        [Authorize]
        public async Task<IActionResult> Update(int supplierId, [FromForm] UpdateSupplierRequestDto supplierDto)
        {
            var supplier = await _supplierRepo.UpdateAsync(supplierId, supplierDto);

            if(supplier == null)
            {
                return BadRequest("supplier_not_found");
            }

            return Ok(supplier);
        }

        [HttpPost("add-supplier-user")]
        [Authorize]
        public async Task<IActionResult> AddSupplierUser(CreateSupplierUser supplierUserDto)
        {
            var newSupplierUser = new SupplierUser{
                SupplierId = supplierUserDto.SupplierId,
                UserId = supplierUserDto.UserId,
            };

            var supplierUser = await _supplierUserRepo.AddSupplierUserAsync(newSupplierUser);
            if(supplierUser == null)
            {
                return BadRequest("register_supplieruser_fail_msg");
            }
            return Ok(supplierUser);
        }

    }
}
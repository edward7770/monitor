using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Interfaces;
using backend.Models;
using backend.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Dtos.Client;

namespace backend.Controllers
{
    [Route("api/client")]
    [ApiController]
    public class ClientController : ControllerBase
    {
        readonly private IClientRepository _clientRepo;
        readonly private IClientBalanceRepository _clientBalanceRepo;
        private readonly IWebHostEnvironment _hostEnvironment;
        public ClientController(IClientRepository clientRepo, IClientBalanceRepository clientBalanceRepo, IWebHostEnvironment hostEnvironment)
        {
            _clientRepo = clientRepo;
            _clientBalanceRepo = clientBalanceRepo;
            _hostEnvironment = hostEnvironment;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var supplierModels = await _clientRepo.GetAllAsync();

            return Ok(supplierModels);
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromForm] CreateSupplierRequestDto supplierDto)
        {
            var newClient = new Client {
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
                DateCreated = DateTime.Now,
                UserId = supplierDto.UserId,
                PriceListId = 1,
                PricingId = 5
            };

            var client = await _clientRepo.AddAsync(newClient);
            if(client == null)
            {
                return BadRequest("register_supplier_fail_msg");
            }

            return Ok(client);
        }

        [HttpPost("update/{supplierId}")]
        [Authorize]
        public async Task<IActionResult> Update(int supplierId, [FromForm] UpdateSupplierRequestDto supplierDto)
        {
            var supplier = await _clientRepo.UpdateAsync(supplierId, supplierDto);

            if(supplier == null)
            {
                return BadRequest("supplier_not_found");
            }

            return Ok(supplier);
        }

        [HttpPost("update/balanceType/{clientId}")]
        public async Task<IActionResult> UpdateBalanceType(string clientId, UpdateClientBalanceTypeRequestDto updateClientBalanceTypeRequestDto)
        {
            var clientBalance = await _clientBalanceRepo.UpdateBalanceType(clientId, updateClientBalanceTypeRequestDto.BalanceType);

            if(clientBalance == null)
            {
                return BadRequest("Failed to update balance type");
            }

            return Ok(clientBalance);
        }

        [HttpPost("update/creditLimit")]
        public async Task<IActionResult> UpdateCreditLimit([FromBody] UpdateClientCreditLimitRequestDto updateClientCreditLimitRequestDto)
        {
            var clientBalance = await _clientBalanceRepo.UpdateCreditLimit(updateClientCreditLimitRequestDto.BalanceId, updateClientCreditLimitRequestDto.CreditLimit);

            if(clientBalance == null)
            {
                return BadRequest("Failed to update credit limit.");
            }

            return Ok(clientBalance);
        }
    }
}
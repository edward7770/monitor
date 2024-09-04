using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Client;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/client")]
    [ApiController]
    public class ClientController : ControllerBase
    {
        readonly private IClientRepository _clientRepo;
        public ClientController(IClientRepository clientRepo)
        {
            _clientRepo = clientRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var clientModels = await _clientRepo.GetAllAsync();

            return Ok(clientModels);
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateClientRequestDto clientDto)
        {
            var newClient = new Client{
                Name = clientDto.Name,
                Surname = clientDto.Surname,
                Email = clientDto.Email,
                Mobile = clientDto.Mobile,
                Phone = clientDto.Phone,
                AddressLine1 = clientDto.AddressLine1,
                AddressLine2 = clientDto.AddressLine2,
                AddressLine3 = clientDto.AddressLine3,
                AddressLine4 = clientDto.AddressLine4,
                AddressPostalCode = clientDto.AddressPostalCode,
                DateCreated = DateTime.Now,
                UserId = clientDto.UserId
            };

            var client = await _clientRepo.AddAsync(newClient);
            if(client == null)
            {
                return BadRequest("register_client_fail_msg");
            }
            
            return Ok(client);
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.ClientTransaction;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/transaction")]
    [ApiController]
    public class ClientTransactionController : ControllerBase
    {
        readonly private IClientTransactionRepository _clientTransactionRepo;
        readonly private IClientBalanceRepository _clientBalanceRepo;
        public ClientTransactionController(IClientTransactionRepository clientTransactionRepo, IClientBalanceRepository clientBalanceRepo)
        {
            _clientTransactionRepo = clientTransactionRepo;
            _clientBalanceRepo = clientBalanceRepo;
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateClientTransactionRequestDto createClientTransactionRequestDto)
        {
            var newClientTransaction = new ClientTransaction {
                ClientId = createClientTransactionRequestDto.ClientId,
                BalanceId = createClientTransactionRequestDto.BalanceId,
                MatchId = createClientTransactionRequestDto.MatchId,
                Records = createClientTransactionRequestDto.Records,
                BillValue = createClientTransactionRequestDto.BillValue,
                DateCreated = DateTime.Now,
                InvoiceNumber = null,
                InvoiceStatus = null
            };

            var clientTransaction = await _clientTransactionRepo.AddAsync(newClientTransaction);
            
            if(createClientTransactionRequestDto.InvoiceNumber == null)
            {
                await _clientBalanceRepo.UpdateAsync(createClientTransactionRequestDto.BalanceId, createClientTransactionRequestDto.BillValue);
            }

            if(clientTransaction == null)
            {
                return StatusCode(403, "Failed to create client transaction.");
            }

            return Ok(clientTransaction);
        }
    }
}
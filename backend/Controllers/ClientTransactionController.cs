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
                FileName = createClientTransactionRequestDto.FileName,
                Monitor = createClientTransactionRequestDto.Monitor,
                Records = createClientTransactionRequestDto.Records,
                BillValue = createClientTransactionRequestDto.BillValue,
                Balance = createClientTransactionRequestDto.Balance,
                DateCreated = DateTime.Now,
                InvoiceNumber = null,
                InvoiceStatus = null
            };

            var clientTransaction = await _clientTransactionRepo.AddAsync(newClientTransaction);

            if(clientTransaction == null)
            {
                return StatusCode(403, "Failed to create client transaction.");
            }

            var clientBalance = await _clientBalanceRepo.GetClientBalanceByIdAsync(createClientTransactionRequestDto.ClientId);

            if(clientBalance == null)
            {
                return StatusCode(403, "Failed to get client balance.");
            }

            if(createClientTransactionRequestDto.BalanceType == "prepaid" && clientBalance.Balance < createClientTransactionRequestDto.BillValue)
            {
                return StatusCode(403, "To download this file, you need to deposit R " + (createClientTransactionRequestDto.BillValue - clientBalance.Balance) + "!");
            }
            
            if(createClientTransactionRequestDto.BalanceType == "postpaid" && clientBalance.Balance + clientBalance.CreditLimit < createClientTransactionRequestDto.BillValue)
            {
                return StatusCode(403, "The cost of the file exceeds your balance of R " + (createClientTransactionRequestDto.BillValue - clientBalance.Balance - clientBalance.CreditLimit) + "!");
            }

            await _clientBalanceRepo.UpdateAsync(createClientTransactionRequestDto.BalanceId, createClientTransactionRequestDto.BillValue);

            return Ok(clientTransaction);
        }
    }
}
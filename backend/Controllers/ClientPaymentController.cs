using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.ClientPayment;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/payment")]
    [ApiController]
    public class ClientPaymentController :ControllerBase
    {
        readonly private IClientPaymentRepository _clientPaymentRepo;
        readonly private IClientBalanceRepository _clientBalanceRepo;
        public ClientPaymentController(IClientPaymentRepository clientPaymentRepo, IClientBalanceRepository clientBalanceRepo)
        {
            _clientPaymentRepo = clientPaymentRepo;
            _clientBalanceRepo = clientBalanceRepo;
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateClientPaymentRequestDto createClientPaymentRequestDto)
        {
            var newClientPayment = new ClientPayment {
                ClientId = createClientPaymentRequestDto.ClientId,
                PaymentAmount = createClientPaymentRequestDto.PaymentAmount,
                PaymentDate = createClientPaymentRequestDto.PaymentDate,
                CapturedBy = createClientPaymentRequestDto.CapturedBy,
                CapturedDate = DateTime.Now,
                BalanceId = createClientPaymentRequestDto.BalanceId,
                Balance = createClientPaymentRequestDto.Balance,
                Note = createClientPaymentRequestDto.Note
            };

            var clientPayment = await _clientPaymentRepo.AddAsync(newClientPayment);

            if(clientPayment == null)
            {
                return StatusCode(403, "Failed to add payment.");
            }

            var clientBalance = await _clientBalanceRepo.UpdateAsync(createClientPaymentRequestDto.BalanceId, -Math.Abs(createClientPaymentRequestDto.PaymentAmount));

            return Ok(clientPayment);
        }
    }
}
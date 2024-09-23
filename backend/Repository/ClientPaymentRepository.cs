using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Interfaces;
using backend.Models;

namespace backend.Repository
{
    public class ClientPaymentRepository : IClientPaymentRepository
    {
        ApplicationDBContext _context;
        public ClientPaymentRepository(ApplicationDBContext context)
        {
            _context = context;
        }
        public async Task<ClientPayment> AddAsync(ClientPayment clientPayment)
        {
            await _context.ClientPayments.AddAsync(clientPayment);
            await _context.SaveChangesAsync();

            return clientPayment;
        }
    }
}
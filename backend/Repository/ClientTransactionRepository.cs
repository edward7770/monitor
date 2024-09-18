using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Interfaces;
using backend.Models;

namespace backend.Repository
{
    public class ClientTransactionRepository : IClientTransactionRepository
    {
        ApplicationDBContext _context;
        public ClientTransactionRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<ClientTransaction> AddAsync(ClientTransaction newClientTransaction)
        {
            await _context.ClientTransactions.AddAsync(newClientTransaction);
            await _context.SaveChangesAsync();

            return newClientTransaction;
        }
    }
}
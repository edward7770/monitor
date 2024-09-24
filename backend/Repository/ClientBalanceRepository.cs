using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class ClientBalanceRepository : IClientBalanceRepository
    {
        ApplicationDBContext _context;
        public ClientBalanceRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<ClientBalance> AddAsync(ClientBalance clientBalance)
        {
            await _context.ClientBalances.AddAsync(clientBalance);
            await _context.SaveChangesAsync();

            return clientBalance;
        }

        public async Task<ClientBalance> GetClientBalanceByIdAsync(string clientId)
        {
            var clientBalance = await _context.ClientBalances.FirstOrDefaultAsync(x => x.ClientId == clientId);
            
            return clientBalance;
        }

        public async Task<ClientBalance> UpdateAsync(int balanceId, int transactionAmount)
        {
            var clientBalance = await _context.ClientBalances.FindAsync(balanceId);

            if(clientBalance != null)
            {
                clientBalance.Balance = clientBalance.Balance - transactionAmount;
            }

            await _context.SaveChangesAsync();

            return clientBalance;
        }

        public async Task<ClientBalance> UpdateBalanceType(string clientId, string balanceType)
        {
            var clientBalance =  await _context.ClientBalances.FirstOrDefaultAsync(x => x.ClientId == clientId);

            if(clientBalance != null)
            {
                clientBalance.Type = balanceType;
            }

            await _context.SaveChangesAsync();

            return clientBalance;
        }

        public async Task<ClientBalance> UpdateCreditLimit(int balanceId, int creditLimit)
        {
            var clientBalance =  await _context.ClientBalances.FindAsync(balanceId);

            if(clientBalance != null)
            {
                clientBalance.CreditLimit = creditLimit;
            }

            await _context.SaveChangesAsync();

            return clientBalance;
        }
    }
}
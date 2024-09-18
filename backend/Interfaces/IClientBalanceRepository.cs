using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;

namespace backend.Interfaces
{
    public interface IClientBalanceRepository
    {
        Task<ClientBalance> GetClientBalanceByIdAsync(string clientId);
        Task<ClientBalance> AddAsync(ClientBalance clientBalance);
        Task<ClientBalance> UpdateAsync(int balanceId, int transactionAmount);
        Task<ClientBalance> UpdateBalanceType(string clientId, string balanceType);
    }
}
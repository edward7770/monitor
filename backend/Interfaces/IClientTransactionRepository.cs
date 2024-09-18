using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;

namespace backend.Interfaces
{
    public interface IClientTransactionRepository
    {
        Task<ClientTransaction> AddAsync(ClientTransaction clientTransaction);
    }
}
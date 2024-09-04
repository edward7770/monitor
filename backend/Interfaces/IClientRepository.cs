using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;

namespace backend.Interfaces
{
    public interface IClientRepository
    {
        Task<List<Client>> GetAllAsync();
        Task<Client> AddAsync(Client client);
        Task<Client> UpdateApprovedDate(string userId); 
        Task<Client> GetByUserIdAsync(string userId);
    }
}
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
    public class ClientRepository : IClientRepository
    {
        ApplicationDBContext _context;

        public ClientRepository(ApplicationDBContext context)
        {
            _context = context;
        }
        public async Task<Client> AddAsync(Client newClient)
        {
            await _context.Clients.AddAsync(newClient);
            await _context.SaveChangesAsync();
            return newClient;
        }

        public async Task<List<Client>> GetAllAsync()
        {
            return await _context.Clients.ToListAsync();
        }

        public async Task<Client> GetByUserIdAsync(string userId)
        {
             return await _context.Clients.FirstOrDefaultAsync(x => x.UserId == userId);
        }

        public async Task<Client> UpdateApprovedDate(string userId)
        {
            var client = await _context.Clients.FirstOrDefaultAsync(s => s.UserId == userId);

            if(client == null)
            {
                throw new ArgumentException("That client was not found", nameof(userId));
            }

            client.DateActivated = DateTime.Now;
            await _context.SaveChangesAsync();
            
            return client;
        }
    }
}
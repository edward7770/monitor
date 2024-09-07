using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Dtos.Client;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class ClientRepository : IClientRepository
    {
        ApplicationDBContext _context;
        
        public ClientRepository(ApplicationDBContext context){
            _context = context;
        }

        public async Task<Client> AddAsync(Client newSupplier)
        {
            await _context.Clients.AddAsync(newSupplier);
            await _context.SaveChangesAsync();
            
            return newSupplier;
        }

        public async Task<List<Client>> GetAllAsync()
        {
            return await _context.Clients.ToListAsync();
        }

        public async Task<Client> GetBySupplierIdAsync(int supplierId)
        {
            return await _context.Clients.FindAsync(supplierId);
        }

        public async Task<Client> GetByUserIdAsync(string userId)
        {
            return await _context.Clients.FirstOrDefaultAsync(x => x.UserId == userId);
        }

        public async Task<Client> UpdateApprovedDate(string userId)
        {
            var supplier = await _context.Clients.FirstOrDefaultAsync(s => s.UserId == userId);

            if(supplier == null)
            {
                throw new ArgumentException("That supplier was not found", nameof(userId));
            }

            // if(supplier.DateActivated != DateTime.Now)
            // {
            //     throw new ArgumentException("The link has been used, login with your username and password!", nameof(userId));
            // }

            supplier.DateActivated = DateTime.Now;
            await _context.SaveChangesAsync();

            return supplier;
        }

        public async Task<Client> UpdateAsync(int supplierId, UpdateSupplierRequestDto supplierRequestDto)
        {
            var supplier = await _context.Clients.FindAsync(supplierId);

            if(supplier == null)
            {
                throw new ArgumentException("That supplier not found!", nameof(supplierId));
            }

            supplier.Name = supplierRequestDto.Name;
            supplier.Surname = supplierRequestDto.Surname;
            supplier.CompanyName = supplierRequestDto.CompanyName;
            supplier.RegistrationNumber = supplierRequestDto.RegistrationNumber;
            supplier.Phone = supplierRequestDto.Phone;
            supplier.Mobile = supplierRequestDto.Mobile;
            supplier.AddressLine1 = supplierRequestDto.AddressLine1;
            supplier.AddressLine2 = supplierRequestDto.AddressLine2;
            supplier.AddressLine3 = supplierRequestDto.AddressLine3;
            supplier.AddressLine4 = supplierRequestDto.AddressLine4;
            supplier.AddressPostalCode = supplierRequestDto.AddressPostalCode;

            await _context.SaveChangesAsync();

            return supplier;
        }
    }
}
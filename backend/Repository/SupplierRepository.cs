using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Dtos.Supplier;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class SupplierRepository : ISupplierRepository
    {
        ApplicationDBContext _context;
        
        public SupplierRepository(ApplicationDBContext context){
            _context = context;
        }

        public async Task<Supplier> AddAsync(Supplier newSupplier)
        {
            await _context.Suppliers.AddAsync(newSupplier);
            await _context.SaveChangesAsync();
            
            return newSupplier;
        }

        public async Task<List<Supplier>> GetAllAsync()
        {
            return await _context.Suppliers.ToListAsync();
        }

        public async Task<Supplier> GetBySupplierIdAsync(int supplierId)
        {
            return await _context.Suppliers.FindAsync(supplierId);
        }

        public async Task<Supplier> GetByUserIdAsync(string userId)
        {
            return await _context.Suppliers.FirstOrDefaultAsync(x => x.UserId == userId);
        }

        public async Task<Supplier> UpdateApprovedDate(string userId)
        {
            var supplier = await _context.Suppliers.FirstOrDefaultAsync(s => s.UserId == userId);

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

        public async Task<Supplier> UpdateAsync(int supplierId, UpdateSupplierRequestDto supplierRequestDto)
        {
            var supplier = await _context.Suppliers.FindAsync(supplierId);

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
            supplier.CompanyRegistrationDoc = supplierRequestDto.CompanyRegistrationDoc;
            supplier.TradeLicenceDoc = supplierRequestDto.TradeLicenceDoc;
            supplier.GovernmentLicenceDoc = supplierRequestDto.GovernmentLicenceDoc;

            await _context.SaveChangesAsync();

            return supplier;
        }
    }
}
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
    public class SupplierUserRepository : ISupplierUserRepository
    {
        ApplicationDBContext _context;
        public SupplierUserRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        async Task<SupplierUser> ISupplierUserRepository.AddSupplierUserAsync(SupplierUser supplierUser)
        {
            await _context.SupplierUsers.AddAsync(supplierUser);
            await _context.SaveChangesAsync();
            
            return supplierUser;
        }

        async Task<List<SupplierUser>> ISupplierUserRepository.GetBySupplierId(int supplierId)
        {
            return await _context.SupplierUsers.Where(x => x.SupplierId == supplierId).ToListAsync();
        }
    }
}
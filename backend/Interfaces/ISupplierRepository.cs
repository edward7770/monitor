using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Supplier;
using backend.Models;

namespace backend.Interfaces
{
    public interface ISupplierRepository
    {
        Task<List<Supplier>> GetAllAsync();
        Task<Supplier> AddAsync(Supplier supplier);
        Task<Supplier> GetBySupplierIdAsync(int supplierId);
        Task<Supplier> UpdateApprovedDate(string userId); 
        Task<Supplier> GetByUserIdAsync(string userId);
        Task<Supplier> UpdateAsync(int supplierId, UpdateSupplierRequestDto supplierRequestDto);
    }
}
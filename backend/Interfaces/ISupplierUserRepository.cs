using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;

namespace backend.Interfaces
{
    public interface ISupplierUserRepository
    {
        Task<List<SupplierUser>> GetBySupplierId(int supplierId);
        Task<SupplierUser> AddSupplierUserAsync(SupplierUser supplierUser);
    }
}
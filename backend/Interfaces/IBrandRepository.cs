using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Brand;
using backend.Models;

namespace backend.Interfaces
{
    public interface IBrandRepository
    {
        Task<List<Brand>> GetAllAsync();
        Task<Brand> AddAsync(Brand newBrand);
        Task<Brand> GetByNameAsync(string name, string type);
        Task<Brand> UpdateStatusAsync(int brandId, UpdateBrandStatusRequestDto statusDto);
    }
}
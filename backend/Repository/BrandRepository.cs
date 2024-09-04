using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Dtos.Brand;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;
namespace backend.Repository
{
    public class BrandRepository : IBrandRepository
    {
        ApplicationDBContext _context;
        public BrandRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public Task<List<Brand>> GetAllAsync()
        {
            return _context.Brands.ToListAsync();
        }

        public async Task<Brand> AddAsync(Brand newBrand)
        {
            await _context.Brands.AddAsync(newBrand);
            await _context.SaveChangesAsync();

            return newBrand;
        }



        public async Task<Brand> GetByNameAsync(string name, string type)
        {
            return await _context.Brands.FirstOrDefaultAsync(s => s.Name == name && s.Type == type);
        }

        public async Task<Brand> UpdateStatusAsync(int brandId, UpdateBrandStatusRequestDto statusDto)
        {
            var brandModel = await _context.Brands.FindAsync(brandId);

            if (brandModel == null)
            {
                throw new ArgumentException("That Solution not found", nameof(brandId));
            }

            brandModel.Status = statusDto.Status;

            if (statusDto.Status == 1)
            {
                brandModel.DateApproved = DateTime.Now;
                brandModel.ApprovedByUserId = statusDto.UserId;
            }

            await _context.SaveChangesAsync();

            return brandModel;
        }
    }
}
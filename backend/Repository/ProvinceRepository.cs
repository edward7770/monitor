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
    public class ProvinceRepository : IProvinceRepository
    {
        ApplicationDBContext _context;
        public ProvinceRepository(ApplicationDBContext context)
        {
            _context = context;
        }
        public async Task<List<Province>> GetAllAsync()
        {
            return await _context.Provinces.ToListAsync();
        }
    }
}
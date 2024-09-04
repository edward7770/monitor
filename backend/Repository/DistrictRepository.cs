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
    public class DistrictRepository : IDistrictRepository
    {
        ApplicationDBContext _context;
        public DistrictRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public Task<List<District>> GetAllAsync(int provinceId)
        {
            return _context.Districts.Where(x => x.ProvinceId == provinceId).ToListAsync();
        }
    }
}
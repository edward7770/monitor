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
    public class UserResetRepository : IUserResetRepository
    {
        ApplicationDBContext _context;
        public UserResetRepository(ApplicationDBContext context)
        {
            _context = context;
        }
        public async Task<UserReset> AddAsync(UserReset userReset)
        {
            await _context.UserResets.AddAsync(userReset);
            await _context.SaveChangesAsync();
            return userReset;
        }

        public async Task<UserReset> GetUserResetByUserId(string userId)
        {
            return await _context.UserResets.Where(x => x.UserId == userId).OrderByDescending(x => x.Id).FirstOrDefaultAsync();
        }
    }
}
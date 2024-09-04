using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;

namespace backend.Interfaces
{
    public interface IUserResetRepository
    {
        Task<UserReset> GetUserResetByUserId(string userId);
        Task<UserReset> AddAsync(UserReset userReset);
    }
}
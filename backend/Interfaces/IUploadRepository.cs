using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;

namespace backend.Interfaces
{
    public interface IUploadRepository
    {
        Task<Documentation> AddAsync(Documentation documentation);
        Task<Documentation> RemoveAsync(int documentationId);
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;

namespace backend.Interfaces
{
    public interface IDocumentationRepository
    {
        Task<List<Documentation>> GetAllAsync();
        Task<Documentation> AddDocAsync(Documentation documentation);
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.FormData;
using backend.Models;

namespace backend.Interfaces
{
    public interface IFormDataRepository
    {
        Task<List<J187FormRecord>> GetAllForm187Async();
        Task<List<J193FormRecord>> GetAllForm193Async();

    }
}
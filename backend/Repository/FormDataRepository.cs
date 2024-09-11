using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Dtos.FormData;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class FormDataRepository : IFormDataRepository
    {
        FormDataDbContext _formDataContext;

        public FormDataRepository(FormDataDbContext formDataDbContext) {
            _formDataContext = formDataDbContext;
        }

        public async Task<List<J187FormRecord>> GetAllForm187Async()
        {
            return await _formDataContext.J187FormRecords.ToListAsync();
        }

        public async Task<List<J193FormRecord>> GetAllForm193Async()
        {
            return await _formDataContext.J193FormRecords.ToListAsync();
        }
    }
}
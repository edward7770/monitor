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
    public class DocumentationRepository : IDocumentationRepository
    {
        ApplicationDBContext _context;
        public DocumentationRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<Documentation> AddDocAsync(Documentation newDocumentation)
        {
            await _context.Documentations.AddAsync(newDocumentation);
            await _context.SaveChangesAsync();

            return newDocumentation;
        }

        public async Task<List<Documentation>> GetAllAsync()
        {
            return await _context.Documentations.ToListAsync();
        }
    }
}
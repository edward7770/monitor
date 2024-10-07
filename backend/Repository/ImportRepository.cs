using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Dtos.Import;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class ImportRepository : IImportRepository
    {
        ApplicationDBContext _context;
        public ImportRepository(ApplicationDBContext context)
        {
            _context = context;
        }
        public async Task<XJ187> AddFormData187Async(XJ187 xJ187)
        {
            await _context.XJ187s.AddAsync(xJ187);
            await _context.SaveChangesAsync();
            
            return xJ187;
        }

        public async Task<XJ193> AddFormData193Async(XJ193 xJ193)
        {
            await _context.XJ193s.AddAsync(xJ193);
            await _context.SaveChangesAsync();

            return xJ193;
        }

        public async Task<Import> AddImportDataAsync(Import import)
        {
            await _context.Imports.AddAsync(import);
            await _context.SaveChangesAsync();

            return import;
        }

        public async Task<Import> UpdateImportRecordsAsync(int importId, int records)
        {
            var import = await _context.Imports.FindAsync(importId);
            import.Records = records;
            await _context.SaveChangesAsync();

            return import;
        }


        public async Task<Import> UpdateImportProgressAsync(int importId, int progress)
        {
            var import = await _context.Imports.FindAsync(importId);
            import.Progress = progress;
            await _context.SaveChangesAsync();

            return import;
        }

        public async Task<Import> UpdateImportEndDateAsync(int importId)
        {
            var import = await _context.Imports.FindAsync(importId);
            import.EndDate = DateTime.Now;
            await _context.SaveChangesAsync();

            return import;
        }

        public async Task<List<importDto>> GetAllImportsAsync()
        {
            var imports = await _context.Imports.Include(i => i.AppUser).Select(x => new importDto {
                Id = x.Id,
                Type = x.Type,
                Progress = x.Progress,
                Records = x.Records,
                StartDate = x.StartDate,
                EndDate = x.EndDate,
                Name = x.AppUser.Name
            }).ToListAsync();

            return imports;
        }
    }
}
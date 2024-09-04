using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Interfaces;
using backend.Models;

namespace backend.Repository
{
    public class UploadRepository : IUploadRepository
    {
        ApplicationDBContext _context;
        public UploadRepository(ApplicationDBContext context)
        {
            _context = context;
        }
        public async Task<Documentation> AddAsync(Documentation documentation)
        {
            await _context.Documentations.AddAsync(documentation);
            await _context.SaveChangesAsync();

            return documentation;
        }

        public async Task<Documentation> RemoveAsync(int documentationId)
        {
            var documentation = await _context.Documentations.FindAsync(documentationId);

            if(documentation == null)
            {
                throw new ArgumentException("That documentation not found", nameof(documentationId));
            }

            _context.Documentations.Remove(documentation);
            await _context.SaveChangesAsync();

            return documentation;
        }
    }
}
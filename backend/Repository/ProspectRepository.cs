using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Dtos.Prospect;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Graph.Models;

namespace backend.Repository
{
    public class ProspectRepository : IProspectRepository
    {
        ApplicationDBContext _context;
        public ProspectRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<Prospect> AddProspectAsync(Prospect prospect)
        {
            await _context.Prospects.AddAsync(prospect);
            await _context.SaveChangesAsync();
            return prospect;
        }

        public async Task<ProspectList> AddProspectListAsync(ProspectList prospectList)
        {
            await _context.ProspectLists.AddAsync(prospectList);
            await _context.SaveChangesAsync();
            return prospectList;
        }

        public async Task<ProspectNote> AddProspectNoteAsync(ProspectNote prospectNote)
        {
            await _context.ProspectNotes.AddAsync(prospectNote);
            await _context.SaveChangesAsync();
            return prospectNote;
        }

        public async Task<List<Prospect>> GetProspectsByListIdAsync(Guid prospectListId)
        {
            var prospects = await _context.Prospects.Where(p => p.Status == 1 && p.Fk_ProspectList_ID == prospectListId).ToListAsync();
            return prospects;
        }

        public async Task<List<ProspectListDto>> GetProspectsListAsync()
        {
            var prospectLists = await _context.ProspectLists
                .Include(pl => pl.Prospects)
                .Select(pl => new ProspectListDto
                {
                    Id = pl.Id,
                    Name = pl.Name,
                    Prospects = pl.Prospects.Select(p => new ProspectDto
                    {
                        Id = p.Id,
                        Name = p.Name,
                        ContactName = p.ContactName,
                        OfficeNumber = p.OfficeNumber,
                        MobileNumber = p.MobileNumber,
                        Email = p.Email,
                        Status = p.Status,
                        StatusDate = p.StatusDate,
                        DateCreated = p.DateCreated,
                        Notes = p.Notes.Select(pn => new ProspectNoteDto
                        {
                            Id = pn.Id,
                            Note = pn.Note,
                            CreatedBy = pn.CreatedBy,
                            DateCreated = pn.DateCreated
                        }).ToList()
                    }).ToList()
                })
                .ToListAsync();

            return prospectLists;
        }

        public async Task<Prospect> UpdateProspectStatusAsync(Guid prospectId, int updatedStatus)
        {
            var prospect = await _context.Prospects.FindAsync(prospectId);
            prospect.Status = updatedStatus;
            prospect.StatusDate = DateTime.Now;
            
            await _context.SaveChangesAsync();
            return prospect;
        }
    }
}
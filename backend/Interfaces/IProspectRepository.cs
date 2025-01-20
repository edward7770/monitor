using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Prospect;
using backend.Models;

namespace backend.Interfaces
{
    public interface IProspectRepository
    {
        Task<ProspectList> AddProspectListAsync(ProspectList prospectList);
        Task<Prospect> AddProspectAsync(Prospect prospect);
        Task<List<ProspectListDto>> GetProspectsListAsync();
        Task<ProspectNote> AddProspectNoteAsync(ProspectNote prospectNote);
        Task<List<Prospect>> GetProspectsByListIdAsync(Guid prospectListId);
        Task<Prospect> UpdateProspectStatusAsync(Guid prospectId, int updatedStatus);
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Import;
using backend.Models;

namespace backend.Interfaces
{
    public interface IImportRepository
    {
        Task<XJ193> AddFormData193Async(XJ193 xJ193);
        Task<XJ187> AddFormData187Async(XJ187 xJ187);
        Task<Import> AddImportDataAsync(Import import);
        Task<Import> UpdateImportRecordsAsync(int importId, int records);
        Task<Import> UpdateImportProgressAsync(int importId, int progress);
        Task<Import> UpdateImportEndDateAsync(int importId);
        Task<List<importDto>> GetAllImportsAsync();
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;

namespace backend.Interfaces
{
    public interface ISolutionProvinceRepository
    {
        Task<SolutionProvince> AddAsync(List<Province> provinces, int solutionId);
        Task<SolutionProvince> UpdateAsync(List<Province> provinces, int solutionId);
    }
}
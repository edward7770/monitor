using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Solution;
using backend.Models;

namespace backend.Interfaces
{
    public interface ISolutionDetailRepository
    {
        Task<SolutionDetail> AddAsync(SolutionDetail newSolutionDetail);
        Task<SolutionDetail> UpdateAsync(int solutionId, UpdateSolutionRequestDto solutionDto);
    }
}
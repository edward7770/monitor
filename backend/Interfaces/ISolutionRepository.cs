using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Solution;
using backend.Models;

namespace backend.Interfaces
{
    public interface ISolutionRepository
    {
        Task<List<SolutionWithDetailDto>> GetAllAsync();
        Task<Solution> AddAsync(Solution newSolution);
        Task<Solution> GetByNameAsync(string name);
        Task<Solution> GetBySolutionId(int solutionId);
        Task<Solution> UpdateStatusAsync(int solutionId, UpdateSolutionStatusRequestDto statusDto);
        Task<Solution> UpdateSolutionAsync(int solutionId, UpdateSolutionRequestDto solutionDto);

    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Dtos.Solution;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class SolutionDetailRepository : ISolutionDetailRepository
    {
        private readonly ApplicationDBContext _context;
        public SolutionDetailRepository(ApplicationDBContext context)
        {
            _context = context;
        }
        public async Task<SolutionDetail> AddAsync(SolutionDetail newSolutionDetail)
        {
            await _context.SolutionDetails.AddAsync(newSolutionDetail);
            await _context.SaveChangesAsync();

            return newSolutionDetail;
        }

        public async Task<SolutionDetail> UpdateAsync(int solutionId, UpdateSolutionRequestDto solutionDto)
        {
            var solutionDetailModel = await _context.SolutionDetails.FirstOrDefaultAsync(sd => sd.SolutionId == solutionId);

            if(solutionDetailModel == null) 
            {
                throw new ArgumentException("That Solution detail not found", nameof(solutionId));
            }

            solutionDetailModel.InverterId = solutionDto.InverterId;
            solutionDetailModel.PanelId = solutionDto.PanelId;
            solutionDetailModel.PanelCount = solutionDto.PanelCount;
            solutionDetailModel.StorageId = solutionDto.StorageId;
            solutionDetailModel.StorageCount = solutionDto.StorageCount;
            solutionDetailModel.StringCount = solutionDto.StringCount;

            await _context.SaveChangesAsync();
            return solutionDetailModel;
        }
    }
}
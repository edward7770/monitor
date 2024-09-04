using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Interfaces;
using backend.Models;

namespace backend.Repository
{
    public class SolutionProvinceRepository : ISolutionProvinceRepository
    {
        ApplicationDBContext _context;
        public SolutionProvinceRepository(ApplicationDBContext context)
        {
            _context = context;
        }
        public async Task<SolutionProvince> AddAsync(List<Province> provinces, int solutionId)
        {
            var solutionProvince = new SolutionProvince{
                SolutionId = solutionId,
                ProvinceId = 0
            };
            
            foreach (var province in provinces)
            {
                var newSolutionProvince = new SolutionProvince{
                    SolutionId = solutionId,
                    ProvinceId = province.Id
                };

                await _context.SolutionProvinces.AddAsync(newSolutionProvince);
            }

            await _context.SaveChangesAsync();

            return solutionProvince;
        }

        public async Task<SolutionProvince> UpdateAsync(List<Province> provinces, int solutionId)
        {
            var solutionProvince = new SolutionProvince{
                SolutionId = solutionId,
                ProvinceId = 0
            };
            
            var existingProvinces =  _context.SolutionProvinces.Where(d => d.SolutionId == solutionId).ToList();
            foreach (var existingProvince in existingProvinces)
            {
                _context.SolutionProvinces.Remove(existingProvince);
            }

           foreach (var province in provinces)
            {
                var newSolutionProvince = new SolutionProvince{
                    SolutionId = solutionId,
                    ProvinceId = province.Id
                };

                await _context.SolutionProvinces.AddAsync(newSolutionProvince);
            }

            await _context.SaveChangesAsync();

            return solutionProvince;
        }
    }
}
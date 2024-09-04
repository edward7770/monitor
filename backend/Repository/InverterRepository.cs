using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Dtos.Inverter;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class InverterRepository : IInverterRepository
    {
        ApplicationDBContext _context;
        public InverterRepository(ApplicationDBContext context)
        {
            _context = context;
        }
        public async Task<List<InverterDto>> GetAllAsync()
        {
            var inverters = await _context.Inverters.Include(x => x.Brand).Select(x => new InverterDto {
                Id = x.Id,
                BrandId = x.BrandId,
                Brand = x.Brand.Name,
                ModelNumber = x.ModelNumber,
                Volts = x.Volts,
                KVA = x.KVA,
                Voc = x.Voc,
                Strings = x.Strings,
                MaxMPPTVolts = x.MaxMPPTVolts,
                MaxMPPTWatts = x.MaxMPPTWatts,
                MaxMPPTAmps = x.MaxMPPTAmps,
                PhaseCount = x.PhaseCount,
                PVOperatingVoltageRange = x.PVOperatingVoltageRange,
                Efficiency = x.Efficiency,
                Status = x.Status,
                DateCreated = x.DateCreated,
                CreatedByUserId = x.CreatedByUserId,
                ApprovedByUserId = x.ApprovedByUserId,
                DateApproved = x.DateApproved,
                Documentations = _context.Documentations.Where(d => d.DeviceId == x.Id && d.Type == "inverter").ToList()
            }).ToListAsync();

            return inverters;
        }

        public async Task<Inverter> AddAsync(Inverter newInverter)
        {
            await _context.Inverters.AddAsync(newInverter);
            await _context.SaveChangesAsync();

            return newInverter;
        }

        public async Task<Inverter> GetByNameAsync(string name)
        {
            return await _context.Inverters.FirstOrDefaultAsync(s => s.ModelNumber == name);
        }

        public async Task<Inverter> UpdateAsync(int inverterId, InverterDto inverterDto)
        {
            var inverterModel = await _context.Inverters.FindAsync(inverterId);
            
            if(inverterModel == null) 
            {
                throw new ArgumentException("That inverter not found", nameof(inverterId));
            }

            inverterModel.BrandId = inverterDto.BrandId;
            inverterModel.ModelNumber = inverterDto.ModelNumber;
            inverterModel.Volts = inverterDto.Volts;
            inverterModel.KVA = inverterDto.KVA;
            inverterModel.Voc = inverterDto.Voc;
            inverterModel.Strings = inverterDto.Strings;
            inverterModel.MaxMPPTVolts = inverterDto.MaxMPPTVolts;
            inverterModel.MaxMPPTWatts = inverterDto.MaxMPPTWatts;
            inverterModel.MaxMPPTAmps = inverterDto.MaxMPPTAmps;
            inverterModel.PhaseCount = inverterDto.PhaseCount;
            inverterModel.PVOperatingVoltageRange = inverterDto.PVOperatingVoltageRange;
            inverterModel.Efficiency = inverterDto.Efficiency;
            inverterModel.Status = inverterDto.Status;

            await _context.SaveChangesAsync();

            return inverterModel;
        }

        public async Task<Inverter> UpdateStatusAsync(int inverterId, UpdateInverterStatusRequestDto inverterDto)
        {
            var inverterModel = await _context.Inverters.FindAsync(inverterId);

            if (inverterModel == null)
            {
                throw new ArgumentException("That Inverter not found", nameof(inverterId));
            }

            inverterModel.Status = inverterDto.Status;

            if (inverterDto.Status == 1)
            {
                inverterModel.DateApproved = DateTime.Now;
                inverterModel.ApprovedByUserId = inverterDto.UserId;
            }

            await _context.SaveChangesAsync();

            return inverterModel;
        }
    }
}
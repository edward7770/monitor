using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Dtos.Storage;
using backend.Interfaces;
using backend.Mappers;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class StorageRepository : IStorageRepository
    {
        ApplicationDBContext _context;

        public StorageRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<List<StorageDto>> GetAllAsync()
        {
            var storages = await _context.Storages.Include(x => x.Brand).Select(x => new StorageDto
            {
                Id = x.Id,
                BrandId = x.BrandId,
                Brand = x.Brand.Name,
                ModelNumber = x.ModelNumber,
                Watts = x.Watts,
                Volts = x.Volts,
                Amps = x.Amps,
                MaxChargingVoltage = x.MaxChargingVoltage,
                FloatChargingVoltage = x.FloatChargingVoltage,
                MaxChargeAmps = x.MaxChargeAmps,
                Weight = x.Weight,
                Status = x.Status,
                DateCreated = x.DateCreated,
                CreatedByUserId = x.CreatedByUserId,
                ApprovedByUserId = x.ApprovedByUserId,
                DateApproved = x.DateApproved,
                Documentations = _context.Documentations.Where(d => d.DeviceId == x.Id && d.Type == "storage").ToList()
            }).ToListAsync();

            return storages;
        }

        public async Task<Storage> AddAsync(Storage newStorage)
        {
            await _context.Storages.AddAsync(newStorage);
            await _context.SaveChangesAsync();

            return newStorage;
        }

        public async Task<Storage> GetByNameAsync(string name)
        {
            return await _context.Storages.FirstOrDefaultAsync(s => s.ModelNumber == name);
        }

        public async Task<Storage> GetStorageIdAsync(int storageId)
        {
            return await _context.Storages.FirstOrDefaultAsync(s => s.Id == storageId);
        }

        public async Task<Storage> UpdateAsync(int storageId, StorageDto storageDto)
        {
            var storageModel = await _context.Storages.FindAsync(storageId);

            if (storageModel == null)
            {
                throw new ArgumentException("That storage not found", nameof(storageId));
            }

            storageModel.BrandId = storageDto.BrandId;
            storageModel.ModelNumber = storageDto.ModelNumber;
            storageModel.Watts = storageDto.Watts;
            storageModel.Volts = storageDto.Volts;
            storageModel.Amps = storageDto.Amps;
            storageModel.MaxChargingVoltage = storageDto.MaxChargingVoltage;
            storageModel.FloatChargingVoltage = storageDto.FloatChargingVoltage;
            storageModel.MaxChargeAmps = storageDto.MaxChargeAmps;
            storageModel.Weight = storageDto.Weight;
            storageModel.Status = storageDto.Status;

            await _context.SaveChangesAsync();

            return storageModel;
        }

        public async Task<Storage> UpdateStatusAsync(int storageId, UpdateStorageRequestDto storageDto)
        {
            var storageModel = await _context.Storages.FindAsync(storageId);

            if (storageModel == null)
            {
                throw new ArgumentException("That Storage not found", nameof(storageId));
            }

            storageModel.Status = storageDto.Status;

            if (storageDto.Status == 1)
            {
                storageModel.DateApproved = DateTime.Now;
                storageModel.ApprovedByUserId = storageDto.UserId;
            }

            await _context.SaveChangesAsync();

            return storageModel;
        }
    }
}
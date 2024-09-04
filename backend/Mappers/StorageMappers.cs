using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Storage;
using backend.Models;

namespace backend.Mappers
{
    public static class StorageMappers
    {
        public static StorageDto ToStorageDto(this Storage storageModel)
        {
            return new StorageDto
            {
                Id = storageModel.Id,
                Brand = storageModel.Brand.Name,
                BrandId = storageModel.Brand.Id,
                ModelNumber = storageModel.ModelNumber,
                Volts = storageModel.Volts,
                Amps = storageModel.Amps,
                MaxChargingVoltage = storageModel.MaxChargingVoltage,
                FloatChargingVoltage = storageModel.FloatChargingVoltage,
                MaxChargeAmps = storageModel.MaxChargeAmps,
                Weight = storageModel.Weight
            };
        }
    }
}
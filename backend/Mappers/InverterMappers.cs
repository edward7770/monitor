using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Dtos.Inverter;
using backend.Models;

namespace backend.Mappers
{
    public static class InverterMappers
    {
        public static InverterDto ToInverterDto(this Inverter inverterModel )
        {
            return new InverterDto
            {
                Id = inverterModel.Id,
                Brand = inverterModel.Brand.Name,
                BrandId = inverterModel.Brand.Id,
                ModelNumber = inverterModel.ModelNumber,
                Volts = inverterModel.Volts,
                KVA = inverterModel.KVA,
                Voc = inverterModel.Voc,
                Strings = inverterModel.Strings,
                MaxMPPTVolts = inverterModel.MaxMPPTVolts,
                MaxMPPTWatts =  inverterModel.MaxMPPTWatts,
                MaxMPPTAmps = inverterModel.MaxMPPTAmps,
                PhaseCount = inverterModel.PhaseCount,
                PVOperatingVoltageRange = inverterModel.PVOperatingVoltageRange,
                Efficiency = inverterModel.Efficiency
            };
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Inverter;
using backend.Models;

namespace backend.Interfaces
{
    public interface IInverterRepository
    {
        Task<List<InverterDto>> GetAllAsync();
        Task<Inverter> AddAsync(Inverter newInverter);
        Task<Inverter> GetByNameAsync(string name);
        Task<Inverter> UpdateAsync(int inverterId, InverterDto inverterDto);
        Task<Inverter> UpdateStatusAsync(int inverterId, UpdateInverterStatusRequestDto inverterDto);
    }
}
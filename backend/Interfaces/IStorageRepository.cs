using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Storage;
using backend.Models;

namespace backend.Interfaces
{
    public interface IStorageRepository
    {
        Task<List<StorageDto>> GetAllAsync();
        Task<Storage> AddAsync(Storage newStorage);
        Task<Storage> GetByNameAsync(string name);
        Task<Storage> GetStorageIdAsync(int storageId);
        Task<Storage> UpdateAsync(int storageId, StorageDto storageDto);
        Task<Storage> UpdateStatusAsync(int storageId, UpdateStorageRequestDto storageDto);
    }
}
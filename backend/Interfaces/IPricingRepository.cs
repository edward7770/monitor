using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;

namespace backend.Interfaces
{
    public interface IPricingRepository
    {
        Task<List<Pricing>> GetPricingsByListId(int PriceListId);
        Task<List<Pricing>> GetAllPricingsAsync();
        Task<Pricing> GetPricingById(int priceId);
        Task<Pricing> AddPricingTierAsync(Pricing pricing);
        Task<Pricing> DeletePricingTierAsync(int priceId);
        Task<Pricing> UpdatePricingTierAsync(int priceId, Pricing pricing);
        Task<List<Pricing>> DuplicatePriceListAsync(string newListName);
    }
}
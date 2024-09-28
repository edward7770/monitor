using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class PricingRepository : IPricingRepository
    {
        ApplicationDBContext _context;
        public PricingRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<Pricing> AddPricingTierAsync(Pricing pricing)
        {
            await _context.Pricings.AddAsync(pricing);
            await _context.SaveChangesAsync();
            return pricing;
        }

        public async Task<Pricing> DeletePricingTierAsync(int priceId)
        {
            var pricing = await _context.Pricings.FirstOrDefaultAsync(p => p.Id == priceId);

            var clients = await _context.Clients.Where(c => c.PricingId == priceId).ToListAsync();

            if(clients.Count != 0)
            {
                throw new ArgumentException("That pricing is linked to clients!", nameof(priceId));
            }

            if (pricing != null && clients.Count == 0)
            {
                _context.Pricings.Remove(pricing);
                await _context.SaveChangesAsync();
            }

            return pricing;
        }

        public async Task<List<Pricing>> DuplicatePriceListAsync(string newListName)
        {
            var defaultPriceList = await _context.Pricings.Where(p => p.List == 1).ToListAsync();

            var newList = await _context.Pricings.MaxAsync(x => x.List);

            foreach (var item in defaultPriceList)
            {
                var newDuplicatePriceTier = new Pricing {
                    List = newList + 1,
                    ListName = newListName,
                    Tier = item.Tier,
                    Description = item.Description,
                    Start = item.Start,
                    End = item.End,
                    Price = item.Price,
                };

                await _context.Pricings.AddAsync(newDuplicatePriceTier);
            };

            await _context.SaveChangesAsync();

            return defaultPriceList;
        }

        public async Task<List<Pricing>> GetAllPricingsAsync()
        {
            var pricings = await _context.Pricings.ToListAsync();

            return pricings;
        }

        public async Task<Pricing> GetPricingById(int priceId)
        {
            var pricing = await _context.Pricings.FindAsync(priceId);

            return pricing;
        }

        public async Task<List<Pricing>> GetPricingsByListId(int PriceListId)
        {
            var pricings = await _context.Pricings.Where(p => p.List == PriceListId).ToListAsync();

            return pricings;
        }

        public async Task<Pricing> UpdatePricingTierAsync(int priceId, Pricing pricingDto)
        {
            var pricing = await _context.Pricings.FindAsync(priceId);

            if (pricing == null)
            {
                throw new ArgumentException("That pricing not found!", nameof(priceId));
            }

            if (pricing.ListName != pricingDto.ListName)
            {
                var pricingList = await _context.Pricings.Where(x => x.List == pricingDto.List).ToListAsync();

                foreach (var item in pricingList)
                {
                    item.ListName = pricingDto.ListName;
                }
            }

            pricing.ListName = pricingDto.ListName;
            pricing.Tier = pricingDto.Tier;
            pricing.Description = pricingDto.Description;
            pricing.Start = pricingDto.Start;
            pricing.End = pricingDto.End;
            pricing.Price = pricingDto.Price;

            await _context.SaveChangesAsync();

            return pricing;
        }
    }
}
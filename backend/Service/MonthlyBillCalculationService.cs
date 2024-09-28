using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Service
{
    public class MonthlyBillCalculationService : IMonthlyBillCalculationServiceRepository
    {
        private readonly ApplicationDBContext _context;
        private readonly IMatchResultRepository _matchResultRepo;
        public MonthlyBillCalculationService(ApplicationDBContext context, IMatchResultRepository matchResultRepo)
        {
            _context = context;
            _matchResultRepo = matchResultRepo;
        }

        public async Task ProcessMonthlyCalculation(string userId)
        {
            var client = await _context.Clients.FirstOrDefaultAsync(c => c.UserId == userId);

            if(client == null)
            {
                throw new Exception("Client not found");
            }

            var monthlyMatchedResultsCount = await _matchResultRepo.GetMatchedResultsCountByClient(userId, DateTime.Now.AddMonths(-1) ,DateTime.Now);

            var currentPricing = await _context.Pricings.FindAsync(client.PricingId);

            var pricingModel = await _context.Pricings.FirstOrDefaultAsync(p => p.List == client.PriceListId && p.Start <= monthlyMatchedResultsCount && p.End >= monthlyMatchedResultsCount);

            client.PricingId = pricingModel.Id;

            await _context.SaveChangesAsync();


        }
    }
}
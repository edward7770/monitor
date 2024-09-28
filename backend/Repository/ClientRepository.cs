using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Dtos.Client;
using backend.Dtos.ClientPayment;
using backend.Dtos.ClientTransaction;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class ClientRepository : IClientRepository
    {
        ApplicationDBContext _context;

        public ClientRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<Client> AddAsync(Client newSupplier)
        {
            await _context.Clients.AddAsync(newSupplier);
            await _context.SaveChangesAsync();

            return newSupplier;
        }

        public async Task<Client> GetBySupplierIdAsync(int supplierId)
        {
            return await _context.Clients.FindAsync(supplierId);
        }

        public async Task<Client> GetByUserIdAsync(string userId)
        {
            return await _context.Clients.FirstOrDefaultAsync(x => x.UserId == userId);
        }

        public async Task<Client> UpdateApprovedDate(string userId)
        {
            var supplier = await _context.Clients.FirstOrDefaultAsync(s => s.UserId == userId);

            if (supplier == null)
            {
                throw new ArgumentException("That supplier was not found", nameof(userId));
            }

            // if(supplier.DateActivated != DateTime.Now)
            // {
            //     throw new ArgumentException("The link has been used, login with your username and password!", nameof(userId));
            // }

            supplier.DateActivated = DateTime.Now;
            await _context.SaveChangesAsync();

            return supplier;
        }

        public async Task<Client> UpdateAsync(int supplierId, UpdateSupplierRequestDto supplierRequestDto)
        {
            var supplier = await _context.Clients.FindAsync(supplierId);

            if (supplier == null)
            {
                throw new ArgumentException("That supplier not found!", nameof(supplierId));
            }

            supplier.Name = supplierRequestDto.Name;
            supplier.Surname = supplierRequestDto.Surname;
            supplier.CompanyName = supplierRequestDto.CompanyName;
            supplier.RegistrationNumber = supplierRequestDto.RegistrationNumber;
            supplier.Phone = supplierRequestDto.Phone;
            supplier.Mobile = supplierRequestDto.Mobile;
            supplier.AddressLine1 = supplierRequestDto.AddressLine1;
            supplier.AddressLine2 = supplierRequestDto.AddressLine2;
            supplier.AddressLine3 = supplierRequestDto.AddressLine3;
            supplier.AddressLine4 = supplierRequestDto.AddressLine4;
            supplier.AddressPostalCode = supplierRequestDto.AddressPostalCode;

            await _context.SaveChangesAsync();

            return supplier;
        }

        public async Task<List<ClientDto>> GetAllAsync()
        {
            var clients = await (from c in _context.Clients
                                 join cm in _context.ClientBalances on c.UserId equals cm.ClientId
                                 select new ClientDto
                                 {
                                     Id = c.Id,
                                     Name = c.Name + " " + c.Surname,
                                     Surname = c.Surname,
                                     Email = c.ContactEmail,
                                     CompanyName = c.CompanyName,
                                     UserId = c.UserId,
                                     RegistrationNumber = c.RegistrationNumber,
                                     Phone = c.Phone,
                                     Mobile = c.Mobile,
                                     AddressLine1 = c.AddressLine1,
                                     AddressLine2 = c.AddressLine2,
                                     AddressLine3 = c.AddressLine3,
                                     AddressLine4 = c.AddressLine4,
                                     AddressPostalCode = c.AddressPostalCode,
                                     PricingId = c.PricingId,
                                     PriceListId = c.PriceListId,
                                     BalanceId = cm.Id,
                                     BalanceType = cm.Type,
                                     BalanceAmount = cm.Balance,
                                     CreditLimit = cm.CreditLimit
                                 }).ToListAsync();

            var clientIds = clients.Select(c => c.UserId).ToList();

            var transactions = await (from t in _context.ClientTransactions
                                      where clientIds.Contains(t.ClientId)
                                      select new ClientActivityDto
                                      {
                                          Id = t.Id,
                                          ClientId = t.ClientId,
                                          MatchId = t.MatchId,
                                          Records = t.Records,
                                          FileName = t.FileName,
                                          Type = "Transaction",
                                          Monitor = t.Monitor,
                                          BillValue = t.BillValue,
                                          Balance = t.Balance,
                                          DateCreated = t.DateCreated,
                                          InvoiceNumber = t.InvoiceNumber,
                                          InvoiceStatus = t.InvoiceStatus,
                                          UniqueFileName = (from m in _context.Matches
                                                            where m.Id == t.MatchId
                                                            select m.UniqueFileName).FirstOrDefault()
                                      }).ToListAsync();

            var payments = await (from p in _context.ClientPayments
                                  where clientIds.Contains(p.ClientId)
                                  select new ClientActivityDto
                                  {
                                      Id = p.Id,
                                      ClientId = p.ClientId,
                                      PaymentAmount = p.PaymentAmount,
                                      PaymentDate = p.PaymentDate,
                                      Type = "Payment",
                                      Balance = p.Balance,
                                      CapturedBy = (from u in _context.Users
                                                            where u.Id == p.CapturedBy
                                                            select u.Email).FirstOrDefault(),
                                      DateCreated = p.CapturedDate
                                  }).ToListAsync();


            foreach (var client in clients)
            {
                var combinedActivities = transactions
                    .Where(t => t.ClientId == client.UserId)
                    .Concat(payments.Where(p => p.ClientId == client.UserId))
                    .OrderByDescending(a => a.DateCreated)
                    .ToList();

                client.TransactionsWithPayments = combinedActivities;
            }

            return clients;
        }


    }
}
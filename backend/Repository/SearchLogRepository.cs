using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Dtos.Client;
using backend.Dtos.SearchLog;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class SearchLogRepository : ISearchLogRepository
    {
        ApplicationDBContext _context;
        public SearchLogRepository(ApplicationDBContext context)
        {
            _context = context;
        }
        public async Task<SearchLog> AddAsync(SearchLog createSearchLogRequestDto)
        {
            await _context.SearchLogs.AddAsync(createSearchLogRequestDto);
            await _context.SaveChangesAsync();

            return createSearchLogRequestDto;
        }

        public async Task<List<ClientWithSearchLogsDto>> GetAllAsync()
        {
            var clientsWithLogs = await _context.Clients
                .GroupJoin(
                    _context.SearchLogs,
                    client => client.UserId,
                    searchLog => searchLog.UserId,
                    (client, searchLogs) => new ClientWithSearchLogsDto
                    {
                        Id = client.Id,
                        Name = client.Name + " " + client.Surname,
                        Surname = client.Surname,
                        Email = client.ContactEmail,
                        CompanyName = client.CompanyName,
                        UserId = client.UserId,
                        RegistrationNumber = client.RegistrationNumber,
                        Phone = client.Phone,
                        Mobile = client.Mobile,
                        AddressLine1 = client.AddressLine1,
                        AddressLine2 = client.AddressLine2,
                        AddressLine3 = client.AddressLine3,
                        AddressLine4 = client.AddressLine4,
                        AddressPostalCode = client.AddressPostalCode,
                        SearchLogs = searchLogs.Select(log => new SearchLogDto
                        {
                            Id = log.Id,
                            SearchString = log.SearchString,
                            Type = log.Type,
                            UserId = log.UserId,
                            Date = log.Date
                        }).ToList()
                    }
                ).ToListAsync();


            return clientsWithLogs;
        }
    }
}
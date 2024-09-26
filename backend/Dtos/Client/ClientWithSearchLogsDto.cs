using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.SearchLog;
using backend.Models;

namespace backend.Dtos.Client
{
    public class ClientWithSearchLogsDto
    {
        public int Id { get; set; }
        [StringLength(50)]
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Email { get; set; }
        public string CompanyName { get; set; }
        [StringLength(50)]
        public string RegistrationNumber { get; set; }
        [StringLength(50)]
        public string ContactEmail { get; set; }
        public string Phone { get; set; }
        public string Mobile { get; set; }
        [StringLength(50)]
        public string AddressLine1 { get; set; }
        [StringLength(50)]
        public string AddressLine2 { get; set; }
        [StringLength(50)]
        public string AddressLine3 { get; set; }
        [StringLength(50)]
        public string AddressLine4 { get; set; }
        [StringLength(15)]
        public string AddressPostalCode { get; set; }
        public string UserId { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateActivated { get; set; }
        public int BalanceId { get; set; }
        public string BalanceType { get; set; }
        public int BalanceAmount { get; set; }
        public int CreditLimit { get; set; }
        public List<SearchLogDto> SearchLogs { get; set; }
    }
}
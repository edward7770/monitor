using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Client
{
    public class ClientActivityDto
    {
        public int Id { get; set; }
        public string ClientId { get; set; }
        public int Balance { get; set; }
        public string Type { get; set; }
        public int PaymentAmount { get; set; }
        public DateTime PaymentDate { get; set; }
        public string CapturedBy { get; set; }
        public string Note { get; set; }
        public int BalanceId { get; set; }
        public int MatchId { get; set; }
        public string FileName { get; set; }
        public string UniqueFileName { get; set; }
        public int Monitor { get; set; }
        public int Records { get; set; }
        public int BillValue { get; set; }
        public DateTime DateCreated { get; set; }
        public string InvoiceNumber { get; set; }
        public string InvoiceStatus { get; set; }
    }
}
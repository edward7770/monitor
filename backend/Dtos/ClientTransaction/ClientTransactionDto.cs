using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.ClientTransaction
{
    public class ClientTransactionDto
    {
        public int Id { get; set; }
        public string ClientId { get; set; }
        public int BalanceId { get; set; }
        public int MatchId { get; set; }
        public string FileName { get; set; }
        public string UniqueFileName { get; set; }
        public int Monitor { get; set; }
        public int Records { get; set; }
        public int BillValue { get; set; }
        public int Balance { get; set; }
        public DateTime DateCreated { get; set; }
        public string InvoiceNumber { get; set; }
        public string InvoiceStatus { get; set; }
    }
}
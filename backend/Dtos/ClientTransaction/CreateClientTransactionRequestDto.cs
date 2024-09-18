using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.ClientTransaction
{
    public class CreateClientTransactionRequestDto
    {
        public string ClientId { get; set; }
        public int BalanceId { get; set; }
        public int MatchId { get; set; }
        public int Records { get; set; }
        public int BillValue { get; set; }
        public DateTime DateCreated { get; set; }
        public string InvoiceNumber { get; set; }
        public string InvoiceStatus { get; set; }
    }
}
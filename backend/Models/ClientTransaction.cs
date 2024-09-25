using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class ClientTransaction
    {
        public int Id { get; set; }
        public string ClientId { get; set; }
        public int BalanceId { get; set; }
        public int MatchId { get; set; }
        public string FileName { get; set; }
        public int Monitor { get; set; }
        public int Records { get; set; }
        public int BillValue { get; set; }
        public int Balance { get; set; }
        public DateTime DateCreated { get; set; }
        public string InvoiceNumber { get; set; }
        public string InvoiceStatus { get; set; }
        [ForeignKey("BalanceId")]
        public ClientBalance ClientBalance { get; set; }
    }
}
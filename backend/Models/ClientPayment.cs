using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class ClientPayment
    {
        public int Id { get; set; }
        public string ClientId { get; set; }
        public int Balance { get; set; }
        public int BalanceId { get; set; }
        public int PaymentAmount { get; set; }
        public DateTime PaymentDate { get; set; }
        public string CapturedBy { get; set; }
        public DateTime CapturedDate { get; set; }
        public string Note { get; set; }
        [ForeignKey("BalanceId")]
        public ClientBalance ClientBalance { get; set; }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.ClientPayment
{
    public class ClientPaymentDto
    {
        public int Id { get; set; }
        public string ClientId { get; set; }
        public int PaymentAmount { get; set; }
        public DateTime PaymentDate { get; set; }
        public string CapturedBy { get; set; }
        public DateTime CapturedDate { get; set; }
        public string Note { get; set; }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Client
{
    public class UpdateClientCreditLimitRequestDto
    {
        public int BalanceId { get; set; }
        public int CreditLimit { get; set; }
    }
}
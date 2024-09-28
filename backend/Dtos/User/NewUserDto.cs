using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;

namespace backend.Dtos.User
{
    public class NewUserDto
    {
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }
        public string Role { get; set; }
        public bool EmailConfirmed { get; set; }
        public bool UserManagement { get; set; }
        public int Status { get; set; }
        public string Province { get; set; }
        public int BalanceId { get; set; }
        public string BalanceType { get; set; }
        public int BalanceAmount { get; set; }
        public int PricingId { get; set; }
        public int PriceListId { get; set; }
        public int Price { get; set; }
    }
}
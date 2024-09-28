using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Pricing
{
    public class PricingTierDto
    {
        public int List { get; set; }
        public string ListName { get; set; }
        public int Tier { get; set; }
        public string Description { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
        public int Price { get; set; }
    }
}
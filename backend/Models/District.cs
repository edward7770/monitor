using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class District
    {
        public int Id { get; set; }
        public int ProvinceId { get; set; }
        public string Name { get; set; }
    }
}
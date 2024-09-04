using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class SolutionProvince
    {
        public int Id { get; set; }
        public int SolutionId { get; set; }
        public int ProvinceId { get; set; }
        public Province Province { get; set; }
    }
}
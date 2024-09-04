using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Brand
{
    public class CreateBrandRequestDto
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public string UserId { get; set; }
        public string Role { get; set; }
    }
}
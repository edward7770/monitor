using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Prospect
{
    public class CreateProspectsDto
    {
        public string FileName { get; set; }
        public ICollection<ProspectDto> Prospects { get; set; }
    }
}
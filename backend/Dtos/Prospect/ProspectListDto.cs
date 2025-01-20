using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Prospect
{
    public class ProspectListDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public List<ProspectDto> Prospects { get; set; }
    }
}
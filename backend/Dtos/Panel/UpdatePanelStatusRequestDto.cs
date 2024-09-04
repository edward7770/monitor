using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Panel
{
    public class UpdatePanelStatusRequestDto
    {
        public int Status { get; set; }
        public string UserId { get; set; }
    }
}
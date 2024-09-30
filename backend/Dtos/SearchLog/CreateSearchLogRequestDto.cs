using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.SearchLog
{
    public class CreateSearchLogRequestDto
    {
        public string SearchString { get; set; }
        public string UserId { get; set; }
        public string Type { get; set; }
    }
}
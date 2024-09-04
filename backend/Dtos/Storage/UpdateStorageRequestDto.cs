using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Storage
{
    public class UpdateStorageRequestDto
    {
        public int Status { get; set; }
        public string UserId { get; set; }
    }
}
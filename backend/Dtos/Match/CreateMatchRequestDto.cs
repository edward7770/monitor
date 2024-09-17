using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Match
{
    public class CreateMatchRequestDto
    {
        public string ClientId { get; set; }
        public int Records { get; set; }
        public string Status { get; set; }
        public string FileName { get; set; }
        public string UploadedBy { get; set; }
        public DateTime UploadDate { get; set; }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Match
{
    public class ResultMonitorFileDto
    {
        public string FileName { get; set; }
        public DateTime? DownloadDate { get; set; }
        public int Count187 { get; set; }
        public int Count193 { get; set; }
    }
}
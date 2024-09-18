using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.MatchResult
{
    public class MatchResultDto
    {
        public int Id { get; set; }
        public int MatchId { get; set; }
        public string IdNumber { get; set; }
        public string Type { get; set; }
        public Guid RecordId { get; set; }
        public string RawRecord { get; set; }
        public DateTime DateMatched { get; set; }
        public int MatchedStep { get; set; }
        public DateTime DownloadDate { get; set; }
    }
}
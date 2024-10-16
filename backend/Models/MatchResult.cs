using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class MatchResult
    {
        public int Id { get; set; }
        public int MatchId { get; set; }
        public string IdNumber { get; set; }
        public string Type { get; set; }
        public Guid RecordId { get; set; }
        public string RawRecord { get; set; }
        public DateTime DateMatched { get; set; }
        public int MatchedStep { get; set; } = 0;
        public DateTime DownloadDate { get; set; }
        [ForeignKey("MatchId")]
        public Match Match { get; set; }
    }
}
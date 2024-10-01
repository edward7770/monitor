using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Match
    {
        public int Id { get; set; }
        [ForeignKey("AppUser")]
        public string ClientId { get; set; }
        public int Records { get; set; }
        public string Status { get; set; }
        public string FileName { get; set; }
        public string UniqueFileName { get; set; }
        public string UploadedBy { get; set; }
        public DateTime UploadDate { get; set; }
        public int ProcessProgressRecords { get; set; }
        public DateTime ProcessingStartDate { get; set; }
        public DateTime? ProcessingEndedDate { get; set; }
        public List<MatchResult> MatchResult { get; set; }
        public ICollection<MatchData> MatchDatas { get; set; }
        public virtual AppUser AppUser { get; set; }
    }
}
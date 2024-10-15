using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class MatchData
    {
        public int Id { get; set; }
        public int MatchId { get; set; }
        [StringLength(50)]
        public string IdNumber { get; set; }
        [MaxLength(500)]
        public string OtherData { get; set; }
        [ForeignKey("MatchId")]
        public Match Match { get; set; }
    }
}
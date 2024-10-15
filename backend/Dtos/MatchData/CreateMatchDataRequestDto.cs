using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.MatchData
{
    public class CreateMatchDataRequestDto
    {
        public int MatchId { get; set; }
        [StringLength(50)]
        public string IdNumber { get; set; }
        [MaxLength(500)]
        public string OtherData { get; set; }
    }
}
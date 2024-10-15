using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.MatchResult
{
    public class UpdateDownloadDateDto
    {
        public int MatchId { get; set; }
        public int Step { get; set; }
    }
}
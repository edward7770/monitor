using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.MatchResult;
using backend.Models;

namespace backend.Dtos.Match
{
    public class MatchWithResultsDto
    {
        public int Id { get; set; }
        public string ClientId { get; set; }
        public int Records { get; set; }
        public int J193MatchedCount { get; set; }
        public int J187MatchedCount { get; set; }
        public string Status { get; set; }
        public string FileName { get; set; }
        public string ResultFileName { get; set; }
        public string UploadedBy { get; set; }
        public DateTime UploadDate { get; set; }
        public int ProcessProgressRecords { get; set; }
        public DateTime ProcessingStartDate { get; set; }
        public DateTime? ProcessingEndedDate { get; set; }
        public List<MatchResultDto> MatchResults { get; set;}
        public List<ResultMonitorFileDto> ResultMonitorFiles { get; set; }
    }
}
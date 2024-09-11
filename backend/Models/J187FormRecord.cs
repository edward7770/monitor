using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class J187FormRecord
    {
        [Key]
        public Guid RecordId { get; set; }
        public Guid NoticeFileId { get; set; }
        [MaxLength(500)]
        public string CaseNumber { get; set; }
        [MaxLength(50)]
        public string IdNumber { get; set; }
        public string Name { get; set; }
        public string Particulars { get; set; }
        [MaxLength(250)]
        public string FileName { get; set; }
        public DateTime? NoticeDate { get; set; }
        public long? PageNumber { get; set; }
        public long? LineNumber { get; set; }
        [MaxLength(50)]
        public string FormId { get; set; }
        public string RawRecord { get; set; }
        public DateTime? DateCreated { get; set; }
        public string DescriptionOfAccount { get; set; }
        public string SurvivingSpouseDetails { get; set; }
        public string PeriodOfInspection { get; set; }
        public string AdvertiserDetails { get; set; }
    }
}
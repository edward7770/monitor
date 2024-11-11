using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class J193FormRecord
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
        [Column(TypeName = "datetime")]
        public DateTime? DateCreated { get; set; }
        public string DateOfDeathOriginal { get; set; }
        public string SurvivingSpouseDetails { get; set; }
        public string ExecutorDetails { get; set; }
        public string PeriodAllowed { get; set; }
        public virtual NoticeFile NoticeFile { get; set; }
    }
}
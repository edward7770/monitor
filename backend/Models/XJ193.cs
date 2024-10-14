using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class XJ193
    {
        public Guid Id { get; set; }
        public Guid Fk_RecordId { get; set; }
        [StringLength(50)]
        public string IdNo { get; set; }
        public string CaseNumber { get; set; }
        public string Name { get; set; }
        public string Particulars { get; set; }
        public DateOnly NoticeDate { get; set; }
        public string RawRecord { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime DateCreated { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime DateImported { get; set; }
    }
}
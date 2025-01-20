using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class ProspectNote
    {
        public Guid Id { get; set; }
        [ForeignKey("Prospect")]
        public Guid FK_Prospect_ID { get; set; }
        [MaxLength(1000)]
        public string Note { get; set; }
        public DateTime DateCreated { get; set; }
        public string CreatedBy { get; set; }
        public virtual Prospect Prospect { get; set; }
    }
}
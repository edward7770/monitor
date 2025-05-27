using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Import
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public int Progress { get; set; }
        public int Records { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime StartDate { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? EndDate { get; set; }
        public string? UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public virtual AppUser? AppUser { get; set; }
    }
}
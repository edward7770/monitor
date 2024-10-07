using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;

namespace backend.Dtos.Import
{
    public class importDto
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public int Progress { get; set; }
        public int Records { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime StartDate { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? EndDate { get; set; }
        [ForeignKey("AppUser")]
        public string UserId { get; set; }
        public string Name { get; set; }
        public virtual AppUser AppUser { get; set; }
    }
}
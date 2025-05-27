using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class MonitorHistory
    {
        public int Id { get; set; }
        public int Monitor { get; set; }
        public string FileName { get; set; }
        public int J193Count { get; set; }
        public int J187Count { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime DateCreated { get; set; }
    }
}
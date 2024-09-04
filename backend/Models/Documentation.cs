using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Documentation
    {
        public int Id { get; set; }
        [StringLength(15)]
        public string Type { get; set; }
        public int DeviceId { get; set; }
        [StringLength(50)]
        public string Name { get; set; }
        [StringLength(100)]
        public string File { get; set; }
        public DateTime DateCreated { get; set; }
        public string CreatedByUserId { get; set; }
    }
}
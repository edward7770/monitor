using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Brand
    {
        public int Id { get; set; }
        [StringLength(50)]
        public string Name { get; set; }
        public string Type { get; set; }
        public int Status { get; set; }
        public DateTime DateCreated { get; set; } = DateTime.Now;
        public string CreatedByUserId { get; set; }
        public string ApprovedByUserId { get; set; }
        public DateTime DateApproved { get; set; }
    }
}
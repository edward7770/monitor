using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Solution
    {
        public int Id { get; set; }
        [StringLength(150)]
        public string Name { get; set; }
        [StringLength(255)]
        public string Description { get; set; }
        [Column(TypeName = "decimal(18, 2)")]
        public decimal Price { get; set; }
        public decimal EquipmentPrice { get; set; }
        public int SupplierId { get; set; }
        public Supplier Supplier { get; set; }
        public RejectedReason RejectedReason { get; set; }
        public DateTime DateCreated { get; set; } = DateTime.Now;
        public string CreatedByUserId { get; set; } // userId
        public int Status { get; set; } // userId
        public DateTime DateApprove  { get; set; }
        public string ApprovedByUserId { get; set; }
        // public AppUser? AppUser { get; set; }
        public SolutionDetail SolutionDetail{ get; set; }
    }
}
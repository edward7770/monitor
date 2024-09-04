using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using backend.Models;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Inverter;
using backend.Dtos.SolutionDetail;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace backend.Dtos.Solution
{
    public class SolutionWithDetailDto
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
        public List<Province> Provinces { get; set;}
        public Models.Supplier Supplier { get; set; }
        public Models.RejectedReason RejectedReason { get; set; }
        public DateTime DateCreated { get; set; } = DateTime.Now;
        public DateTime DateApprove { get; set; }
        public string CreatedByUserId { get; set; } // userId
        public int Status { get; set; } // userId
        // public AppUser? AppUser { get; set; }
        public SolutionDetailDto SolutionDetail{ get; set; }
    }
}
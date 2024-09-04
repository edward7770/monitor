using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;

namespace backend.Dtos.Panel
{
    public class PanelDto
    {
        public int Id { get; set; }
        public string Brand { get; set; }
        public int BrandId { get; set; }
        [StringLength(30)]
        public string ModelNumber { get; set; }
        public int Watts { get; set; }
        [Column(TypeName = "decimal(18, 2)")]
        public decimal Voc { get; set; }
        [Column(TypeName = "decimal(18, 2)")]
        public decimal Amps { get; set; }
        [Column(TypeName = "decimal(18, 2)")]
        public decimal Width { get; set; }
        [Column(TypeName = "decimal(18, 2)")]
        public decimal Height { get; set; }
        [Column(TypeName = "decimal(18, 2)")]
        public decimal Depth { get; set; }
        [Column(TypeName = "decimal(18, 2)")]
        public decimal Weight { get; set; }
        [StringLength(15)]
        public string FrameColor { get; set; }
        [StringLength(15)]
        public string Color { get; set; }
        [StringLength(15)]
        public string Connectors { get; set; }
        [StringLength(50)]
        public string Type { get; set; }
        [StringLength(50)]
        public string Technology { get; set; }
        [Column(TypeName = "decimal(18, 2)")]
        public decimal Efficiency { get; set; }
        public int Status { get; set; }
        public DateTime DateCreated { get; set; }
        public string CreatedByUserId { get; set; }
        public string ApprovedByUserId { get; set; }
        public DateTime DateApproved { get; set; }
        public List<Documentation> Documentations { get; set; }
    }
}
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Storage
    {
        public int Id { get; set; }
        public int BrandId { get; set; }
        public Brand Brand { get; set; }
        [StringLength(30)]
        public string ModelNumber { get; set; }
        public int Watts { get; set; }
        [Column(TypeName = "decimal(18, 2)")]
        public decimal Volts { get; set; }
        [Column(TypeName = "decimal(18, 2)")]
        public decimal Amps { get; set; }
        [Column(TypeName = "decimal(18, 2)")]
        public decimal MaxChargingVoltage { get; set; }
        [Column(TypeName = "decimal(18, 2)")]
        public decimal FloatChargingVoltage { get; set; }
        [Column(TypeName = "decimal(18, 2)")]
        public decimal MaxChargeAmps { get; set; }
        [Column(TypeName = "decimal(18, 2)")]
        public decimal Weight { get; set; }
        public int Status { get; set; }
        public DateTime DateCreated { get; set; } = DateTime.Now;
        public string CreatedByUserId { get; set; }
        public string ApprovedByUserId { get; set; }
        public DateTime DateApproved { get; set; }
    }
}
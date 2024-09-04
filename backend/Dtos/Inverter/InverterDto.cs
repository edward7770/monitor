using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;

namespace backend.Dtos.Inverter
{
    public class InverterDto
    {
        public int Id { get; set; }
        public int BrandId { get; set; }
        public string Brand { get; set; }
        public string ModelNumber { get; set; }
        [Column(TypeName = "decimal(18, 2)")]
        public decimal Volts { get; set; }
        [Column(TypeName = "decimal(18, 2)")]
        public decimal KVA { get; set; }
        [Column(TypeName = "decimal(18, 2)")]
        public decimal Voc { get; set; }
        public int Strings { get; set; }
        [Column(TypeName = "decimal(18, 2)")]
        public decimal MaxMPPTVolts { get; set; }
        [Column(TypeName = "decimal(18, 2)")]
        public decimal MaxMPPTWatts { get; set; }
        [Column(TypeName = "decimal(18, 2)")]
        public decimal MaxMPPTAmps { get; set; }
        public int PhaseCount { get; set; }
        public string PVOperatingVoltageRange { get; set; }
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
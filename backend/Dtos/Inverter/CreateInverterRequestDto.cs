using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Inverter
{
    public class CreateInverterRequestDto
    {
        public int BrandId { get; set; }
        public string ModelNumber { get; set; }
        public decimal Volts { get; set; }
        public decimal KVA { get; set; }
        public decimal Voc { get; set; }
        public int Strings { get; set; }
        public decimal MaxMPPTVolts { get; set; }
        public decimal MaxMPPTWatts { get; set; }
        public decimal MaxMPPTAmps { get; set; }
        public int PhaseCount { get; set; }
        public string PVOperatingVoltageRange { get; set; }
        public decimal Efficiency { get; set; }
        public string UserId { get; set; }
        public string Role { get; set; }
    }
}
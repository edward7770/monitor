using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Storage
{
    public class CreateStorageRequestDto
    {
        public int BrandId { get; set; }
        public string ModelNumber { get; set; }
        public int Watts { get; set; }
        public decimal Volts { get; set; }
        public decimal Amps { get; set; }
        public decimal MaxChargingVoltage { get; set; }
        public decimal FloatChargingVoltage { get; set; }
        public decimal MaxChargeAmps { get; set; }
        public decimal Weight { get; set; }
        public string UserId { get; set; }
        public string Role { get; set; }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Panel
{
    public class CreatePanelRequestDto
    {
        public int BrandId { get; set; }
        public string ModelNumber { get; set; }
        public int Watts { get; set; }
        public decimal Voc { get; set; }
        public decimal Amps { get; set; }
        public decimal Width { get; set; }
        public decimal Height { get; set; }
        public decimal Depth { get; set; }
        public decimal Weight { get; set; }
        public string FrameColor { get; set; }
        public string Color { get; set; }
        public string Connectors { get; set; }
        public string Type { get; set; }
        public string Technology { get; set; }
        public decimal Efficiency { get; set; }
        public string UserId { get; set; }
        public string Role { get; set; }
    }
}
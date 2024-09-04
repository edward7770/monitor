using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class SolutionDetail
    {
        public int Id { get; set; }
        public int SolutionId { get; set; }
        public int? InverterId { get; set; }
        public int? PanelId { get; set; }
        public int StringCount { get; set; }
        public int? StorageId { get; set; }
        public int StorageCount { get; set; }
        public int PanelCount { get; set; }
        public Inverter Inverter { get; set; }
        public Panel Panel { get; set; }
        public Storage Storage { get; set; }
    }
}
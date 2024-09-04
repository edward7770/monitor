using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Inverter;
using backend.Dtos.Panel;
using backend.Dtos.Storage;

namespace backend.Dtos.SolutionDetail
{
    public class SolutionDetailDto
    {
        public int Id { get; set; }
        public InverterDto Inverter { get; set; }
        public StorageDto Storage { get; set; }
        public PanelDto Panel { get; set; }
        public int PanelCount { get; set; }
        public int StorageCount { get; set; }
        public int StringCount { get; set; }
    }
}
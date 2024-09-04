using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;

namespace backend.Dtos.Solution
{
    public class CreateSolutionRequestDto
    {
        [StringLength(150)]
        public string Name { get; set; }
        public int InverterId { get; set; }
        public int PanelId { get; set; }
        public int PanelCount { get; set; }
        public int? StorageId { get; set; }
        public int StorageCount { get; set; }
        public string Description { get; set; }
        public int StringCount { get; set; }
        public decimal Price { get; set; }
        public decimal EquipmentPrice { get; set; }
        public string CreatedByEmail { get; set; }
        public int SupplierId { get; set; }
        public List<Province> Provinces { get; set; }
    }
}
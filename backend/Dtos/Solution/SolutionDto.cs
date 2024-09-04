using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Solution
{
    public class SolutionDto
    {
        public int Id { get; set; }
        [StringLength(150)]
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public decimal EquipmentPrice { get; set; }
        public int SolutionId { get; set; }
    }
}
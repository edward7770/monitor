using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Review
    {
        public int Id { get; set; }
        [ForeignKey("Solution")]
        public int SolutionId { get; set; }
        public byte Rating { get; set; }
        public string Description { get; set; }
        public bool Status { get; set; }
        public bool Approved { get; set; }
    }

}
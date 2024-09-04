using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class RejectedReason
    {
        public int Id { get; set; }
        [StringLength(50)]
        public int SolutionId { get; set; }
        public string Reason { get; set; }
        public DateTime RejectedDate { get; set; }
        public string RejectedByUserId { get; set; }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Solution
{
    public class UpdateSolutionStatusRequestDto
    {
        public int Status { get; set; }
        public DateTime DateApprove { get; set; }
        public string ApprovedByUserId { get; set; }
        public string RejectedReason { get; set; }
    }
}
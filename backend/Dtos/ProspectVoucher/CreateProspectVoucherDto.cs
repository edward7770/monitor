using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.ProspectVoucher
{
    public class CreateProspectVoucherDto
    {
        public Guid ProspectListId { get; set; }
        public string Subject { get; set; }
        public int VoucherValue { get; set; }
        [MaxLength(1000)]
        public string BodyText { get; set; }
    }
}
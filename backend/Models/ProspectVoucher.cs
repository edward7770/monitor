using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace backend.Models
{
    public class ProspectVoucher
    {
        public Guid Id { get; set; }
        public Guid ProspectId { get; set; }
        [ForeignKey("ProspectVoucherList")]
        public Guid ProspectVoucherListId { get; set; }
        public string VoucherNumber { get; set; }
        public int VoucherValue { get; set; }
        public string Email { get; set; }
        public DateTime? GeneratedDate { get; set; }
        public DateTime? ClickedDate { get; set; }
        public DateTime? ClaimedDate { get; set; }
        public DateTime? ExpirationDate { get; set; }
        [JsonIgnore]
        public virtual ProspectVoucherList ProspectVoucherList { get; set; }
    }
}
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace backend.Models
{
    public class ProspectVoucherList
    {
        public Guid Id { get; set; }
        [ForeignKey("ProspectList")]
        public Guid ProspectListId { get; set; }
        public string Subject { get; set; }
        public int VoucherValue { get; set; }
        [MaxLength(1000)]
        public string BodyText { get; set; }
        public int EmailsCount { get; set; }
        public int ClickedCount { get; set; }
        public int ClaimedCount { get; set; }
        public DateTime DateCreated { get; set; }
        [JsonIgnore]
        public ICollection<ProspectVoucher> Vouchers { get; set; }
        public virtual ProspectList ProspectList { get; set; }
    }
}
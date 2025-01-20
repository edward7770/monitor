using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Prospect
    {
        public Guid Id { get; set; }
        [ForeignKey("ProspectList")]
        public Guid Fk_ProspectList_ID { get; set; }
        public string Name { get; set; }
        public string ContactName { get; set; }
        public string OfficeNumber { get; set; }
        public string MobileNumber { get; set; }
        public string Email { get; set; }
        public int Status { get; set; }
        public DateTime StatusDate { get; set; }
        public DateTime DateCreated { get; set; }
        [JsonIgnore]
        public ICollection<ProspectNote> Notes { get; set; }
        public ICollection<ProspectVoucher> ProspectVouchers { get; set; }
        public virtual ProspectList ProspectList { get; set; }
    }
}
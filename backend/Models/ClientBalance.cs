using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace backend.Models
{
    public class ClientBalance
    {
        public int Id { get; set; }
        [ForeignKey("AppUser")]
        public string ClientId { get; set; }
        public string Type { get; set; }
        public int Balance { get; set; }
        public int CreditLimit { get; set; }
        [JsonIgnore]
        public ICollection<ClientTransaction> Transactions { get; set; }
        [JsonIgnore]
        public ICollection<ClientPayment> Payments { get; set; }        
        [JsonIgnore]
        public virtual AppUser AppUser { get; set; }
    }
}
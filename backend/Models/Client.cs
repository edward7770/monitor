using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Client
    {
        public int Id { get; set; }
        [StringLength(50)]
        public string Name { get; set; }
        public string Surname { get; set; }
        public string CompanyName { get; set; }
        [StringLength(50)]
        public string RegistrationNumber { get; set; }
        [StringLength(50)]
        public string ContactEmail { get; set; }
        public string Phone { get; set; }
        public string Mobile { get; set; }
        [StringLength(50)]
        public string AddressLine1 { get; set; }
        [StringLength(50)]
        public string AddressLine2 { get; set; }
        [StringLength(50)]
        public string AddressLine3 { get; set; }
        [StringLength(50)]
        public string AddressLine4 { get; set; }
        [StringLength(15)]
        public string AddressPostalCode { get; set; }
        [ForeignKey("AppUser")]
        public string UserId { get; set; }
        [ForeignKey("Pricing")]
        public int PricingId { get; set; }
        public int PriceListId { get; set; }
        public virtual AppUser AppUser { get; set; }
        public virtual Pricing Pricing { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateActivated { get; set; }
        public ICollection<SearchLog> SearchLogs { get; set; }
    }
}
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Supplier
{
    public class UpdateSupplierRequestDto
    {
        [StringLength(50)]
        public string Name { get; set; }
        public string Surname { get; set; }
        public string CompanyName { get; set; }
        [StringLength(50)]
        public string RegistrationNumber { get; set; }
        [StringLength(50)]
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
        public string CompanyRegistrationDoc { get; set; }
        public string TradeLicenceDoc { get; set; }
        public string GovernmentLicenceDoc { get; set; }
    }
}
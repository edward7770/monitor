using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class SupplierUser
    {
        public int Id { get; set; }
        public int SupplierId { get; set; }
        public string UserId { get; set; }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.SupplierUser
{
    public class CreateSupplierUser
    {
        public int SupplierId { get; set; }
        public string UserId { get; set; }
    }
}
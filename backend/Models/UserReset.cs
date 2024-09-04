using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class UserReset
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string Key { get; set; }
        public DateTime DateRequested { get; set; }
        public string IPAddress { get; set; }
    }
}
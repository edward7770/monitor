using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class ClientBalance
    {
        public int Id { get; set; }
        public string ClientId { get; set; }
        public string Type { get; set; }
        public int Balance { get; set; }
    }
}
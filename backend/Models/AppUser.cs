using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend.Models
{
    public class AppUser : IdentityUser
    {
        public string forgot_otp { get; set; }
        public string Name { get; set; }
        public int Status { get; set; }
        public DateTime DateCreated { get; set; } = DateTime.Now;
        public virtual Client Client { get; set; }
        public virtual ClientBalance ClientBalance { get; set; }
        public ICollection<Match> Matches { get; set; }
        public ICollection<SearchLog> SearchLogs { get; set; }
    }
}
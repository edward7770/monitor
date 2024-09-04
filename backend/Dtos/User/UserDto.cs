using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace backend.Dtos.User
{
    public class UserDto
    {
        public string UserId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public bool EmailConfirmed { get; set; }
        public bool UserManagement { get; set; }
        public int Status { get; set; }
        public DateTime DateCreated { get; set; }
        public Models.Supplier Supplier { get; set; }
        public Models.Client Client { get; set; }
        public List<string> SupplierUsers { get; set; }
    }
}
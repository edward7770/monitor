using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.User
{
    public class NewUserDto
    {
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }
        public string Role { get; set; }
        public bool EmailConfirmed { get; set; }
        public bool UserManagement { get; set; }
        public int Status { get; set; }
        public string Province { get; set; }
    }
}
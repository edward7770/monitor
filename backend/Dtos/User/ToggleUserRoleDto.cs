using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.User
{
    public class ToggleUserRoleDto
    {
        public string UserId { get; set; }
        public bool CurrentRoleStatus { get; set; }
        public string RoleName { get; set; }
    }
}
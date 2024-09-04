using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.User
{
    public class ForgotDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.User
{
    public class ResetPasswordDto
    {
        [Required]
        public string password { get; set; }
        [Required]
        public string forgot_otp { get; set; }
    }
}
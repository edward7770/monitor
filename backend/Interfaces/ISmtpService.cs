using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.User;
using backend.Models;

namespace backend.Interfaces
{
    public interface ISmtpService
    {
        Task<bool> ActivateMailbySmtp(string email, string name, string confirmationLink);
        Task ForgotPasswordMailBySmtp(string token, string email, string userName);
    }
}
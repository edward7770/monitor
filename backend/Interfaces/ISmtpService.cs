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
        Task<bool> SendProcessResultMailbySmtp(string email, string name);
        Task<bool> SendMonitorActionMailbySmtp(string email, string name);
        Task ForgotPasswordMailBySmtp(string token, string email, string userName);
        Task<bool> SendNewCampaignEmailBySmtp(string email, string subject, string bodyText, int voucherValue, string voucherNumber, DateTime ExpirationDate);
    }
}
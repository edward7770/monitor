using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Net.Sockets;
using System.Threading.Tasks;
using backend.Dtos.Client;
using backend.Interfaces;
using backend.Models;
using DnsClient;

namespace backend.Service
{
    public class SmtpService : ISmtpService
    {
        private readonly IConfiguration _config;
        public SmtpService(IConfiguration config)
        {
            _config = config;
        }

        public async Task<bool> ActivateMailbySmtp(string email, string name, string confirmationLink)
        {
            string App_url = _config["SmtpConfig:applicationUrl"] ?? "";
            string serverEmail = _config["SmtpConfig:Email"] ?? "";
            string serverPassword = _config["SmtpConfig:Password"] ?? "";
            string stmpHost = _config["SmtpConfig:stmpHost"] ?? "";
            int stmpPort = int.Parse(_config["SmtpConfig:stmpPort"] ?? "0");

            if (!await IsDomainValidAsync(email))
            {
                Console.WriteLine("Invalid email domain.");
                return false; // Return false if the domain is not valid
            }

            try
            {
                MailMessage mail = new MailMessage();
                mail.To.Add(email ?? string.Empty);
                mail.From = new MailAddress(serverEmail);
                mail.Subject = "Verify your Monitor account.";

                string mailBody = "";
                mailBody += "<h2>Hello, " + name + "</h2>";
                mailBody += "<a href=" + confirmationLink + "> Please click Below link to activate your account.</a></br>";
                mail.Body = mailBody;
                mail.IsBodyHtml = true;

                SmtpClient smtp = new SmtpClient
                {
                    Port = stmpPort,
                    EnableSsl = true,
                    UseDefaultCredentials = false,
                    Host = stmpHost,
                    Credentials = new NetworkCredential(serverEmail, serverPassword)
                };

                await smtp.SendMailAsync(mail);
                return true;
            }
            catch (SmtpFailedRecipientException ex)
            {
                if (ex.StatusCode == SmtpStatusCode.MailboxUnavailable ||
                    ex.StatusCode == SmtpStatusCode.MailboxNameNotAllowed ||
                    ex.StatusCode == SmtpStatusCode.MailboxBusy)
                {
                    return false;
                }
                return false;
            }
            catch (SmtpException ex)
            {
                Console.WriteLine($"Failed to send email: SMTP error - {ex.Message}.");
                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send email: General error - {ex.Message}.");
                return false;
            }
        }

        private async Task<bool> IsDomainValidAsync(string email)
        {
            try
            {
                var domain = email.Split('@').Last();

                // Create a DNS client
                var lookup = new LookupClient();

                // Query for MX records
                var result = await lookup.QueryAsync(domain, QueryType.MX);

                // Check if any MX records were found
                return result.Answers.MxRecords().Any();
            }
            catch (DnsResponseException)
            {
                // Domain does not exist or no MX records found
                return false;
            }
            catch (Exception)
            {
                // Handle other exceptions if necessary
                return false;
            }
        }

        public async Task ForgotPasswordMailBySmtp(string token, string email, string userName)
        {
            string App_url = _config["SmtpConfig:applicationUrl"] ?? "";
            string serverEmail = _config["SmtpConfig:Email"] ?? "";
            string serverPassword = _config["SmtpConfig:Password"] ?? "";
            string stmpHost = _config["SmtpConfig:stmpHost"] ?? "";
            // int stmpPort = int.Parse(_config["SmtpConfig:stmpPort"]);
            int stmpPort = int.Parse(_config["SmtpConfig:stmpPort"] ?? "0");

            //Send Mail
            MailMessage mail = new MailMessage();
            mail.To.Add(email ?? string.Empty);
            mail.From = new MailAddress(serverEmail);
            mail.Subject = "Did you forget your password?";

            string mailBody = "";
            mailBody += "<h1>Hello " + userName + ",</h1></br></br>";
            mailBody += "Please use the link below to reset your password:</br></br>";
            mailBody += "<p><a href='" + App_url + "/resetpassword?forgot=" + token + "'>Click here to reset your password.</a></p>";
            mail.Body = mailBody;
            mail.IsBodyHtml = true;

            SmtpClient smtp = new SmtpClient();
            smtp.Port = stmpPort;
            smtp.EnableSsl = true;
            smtp.UseDefaultCredentials = false;
            smtp.Host = stmpHost;
            smtp.Credentials = new NetworkCredential(serverEmail, serverPassword);
            smtp.Send(mail);
        }

        public async Task<bool> SendProcessResultMailbySmtp(string email, string name)
        {
            string App_url = _config["SmtpConfig:applicationUrl"] ?? "";
            string serverEmail = _config["SmtpConfig:Email"] ?? "";
            string serverPassword = _config["SmtpConfig:Password"] ?? "";
            string stmpHost = _config["SmtpConfig:stmpHost"] ?? "";
            int stmpPort = int.Parse(_config["SmtpConfig:stmpPort"] ?? "0");

            if (!await IsDomainValidAsync(email))
            {
                Console.WriteLine("Invalid email domain.");
                return false; // Return false if the domain is not valid
            }

            try
            {
                MailMessage mail = new MailMessage();
                mail.To.Add(email ?? string.Empty);
                mail.From = new MailAddress(serverEmail);
                mail.Subject = "Ended Process to match results in Monitor.";

                string mailBody = "";
                mailBody += "<h2>Hello, " + name + "</h2>";
                mailBody += "<p>Your process is ended sucessfully!</p></br>";
                mailBody += "<a href='http://www.superlinq.com:2000'> Please check your account in monitor.</a></br>";
                mail.Body = mailBody;
                mail.IsBodyHtml = true;

                SmtpClient smtp = new SmtpClient
                {
                    Port = stmpPort,
                    EnableSsl = true,
                    UseDefaultCredentials = false,
                    Host = stmpHost,
                    Credentials = new NetworkCredential(serverEmail, serverPassword)
                };

                await smtp.SendMailAsync(mail);
                return true;
            }
            catch (SmtpFailedRecipientException ex)
            {
                if (ex.StatusCode == SmtpStatusCode.MailboxUnavailable ||
                    ex.StatusCode == SmtpStatusCode.MailboxNameNotAllowed ||
                    ex.StatusCode == SmtpStatusCode.MailboxBusy)
                {
                    return false;
                }
                return false;
            }
            catch (SmtpException ex)
            {
                Console.WriteLine($"Failed to send email: SMTP error - {ex.Message}.");
                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send email: General error - {ex.Message}.");
                return false;
            }
        }

        public async Task<bool> SendMonitorActionMailbySmtp(string email, string name)
        {
            string App_url = _config["SmtpConfig:applicationUrl"] ?? "";
            string serverEmail = _config["SmtpConfig:Email"] ?? "";
            string serverPassword = _config["SmtpConfig:Password"] ?? "";
            string stmpHost = _config["SmtpConfig:stmpHost"] ?? "";
            int stmpPort = int.Parse(_config["SmtpConfig:stmpPort"] ?? "0");

            if (!await IsDomainValidAsync(email))
            {
                Console.WriteLine("Invalid email domain.");
                return false; // Return false if the domain is not valid
            }

            try
            {
                MailMessage mail = new MailMessage();
                mail.To.Add(email ?? string.Empty);
                mail.From = new MailAddress(serverEmail);
                mail.Subject = "Ended Monitor Action Process Successfully!";

                string mailBody = "";
                mailBody += "<h2>Hello, " + name + "</h2>";
                mailBody += "<p>Your monitor action process is ended.</p></br>";
                mailBody += "<a href='http://www.superlinq.com:2000'> Please check your account in monitor.</a></br>";
                mail.Body = mailBody;
                mail.IsBodyHtml = true;

                SmtpClient smtp = new SmtpClient
                {
                    Port = stmpPort,
                    EnableSsl = true,
                    UseDefaultCredentials = false,
                    Host = stmpHost,
                    Credentials = new NetworkCredential(serverEmail, serverPassword)
                };

                await smtp.SendMailAsync(mail);
                return true;
            }
            catch (SmtpFailedRecipientException ex)
            {
                if (ex.StatusCode == SmtpStatusCode.MailboxUnavailable ||
                    ex.StatusCode == SmtpStatusCode.MailboxNameNotAllowed ||
                    ex.StatusCode == SmtpStatusCode.MailboxBusy)
                {
                    return false;
                }
                return false;
            }
            catch (SmtpException ex)
            {
                Console.WriteLine($"Failed to send email: SMTP error - {ex.Message}.");
                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send email: General error - {ex.Message}.");
                return false;
            }
        }

        public async Task<bool> SendMonitorUpdatesClientMailbySmtp(string email, string name, string fileName, int J193Count, int J187Count)
        {
            string App_url = _config["SmtpConfig:applicationUrl"] ?? "";
            string serverEmail = _config["SmtpConfig:Email"] ?? "";
            string serverPassword = _config["SmtpConfig:Password"] ?? "";
            string stmpHost = _config["SmtpConfig:stmpHost"] ?? "";
            int stmpPort = int.Parse(_config["SmtpConfig:stmpPort"] ?? "0");

            if (!await IsDomainValidAsync(email))
            {
                Console.WriteLine("Invalid email domain.");
                return false; // Return false if the domain is not valid
            }

            try
            {
                MailMessage mail = new MailMessage();
                mail.To.Add(email ?? string.Empty);
                mail.From = new MailAddress(serverEmail);
                mail.Subject = "Discovered New Records by Monitor Action!";

                string mailBody = "";
                mailBody += "<h5>Hello, " + name + "</h5>";
                mailBody += "<p>" + fileName + " has new " + J193Count + " J193 records and new " + J187Count + " J187 records by monitor action</p></br>";
                mailBody += "<a href='http://www.superlinq.com:2000/history'> Please check your account in monitor.</a></br>";
                mail.Body = mailBody;
                mail.IsBodyHtml = true;

                SmtpClient smtp = new SmtpClient
                {
                    Port = stmpPort,
                    EnableSsl = true,
                    UseDefaultCredentials = false,
                    Host = stmpHost,
                    Credentials = new NetworkCredential(serverEmail, serverPassword)
                };

                await smtp.SendMailAsync(mail);
                return true;
            }
            catch (SmtpFailedRecipientException ex)
            {
                if (ex.StatusCode == SmtpStatusCode.MailboxUnavailable ||
                    ex.StatusCode == SmtpStatusCode.MailboxNameNotAllowed ||
                    ex.StatusCode == SmtpStatusCode.MailboxBusy)
                {
                    return false;
                }
                return false;
            }
            catch (SmtpException ex)
            {
                Console.WriteLine($"Failed to send email: SMTP error - {ex.Message}.");
                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send email: General error - {ex.Message}.");
                return false;
            }
        }

        public async Task<bool> SendNewCampaignEmailBySmtp(string email, string subject, string bodyText, int voucherValue, string voucherNumber, DateTime ExpirationDate)
        {
            string App_url = _config["SmtpConfig:applicationUrl"] ?? "";
            string serverEmail = _config["SmtpConfig:Email"] ?? "";
            string serverPassword = _config["SmtpConfig:Password"] ?? "";
            string stmpHost = _config["SmtpConfig:stmpHost"] ?? "";
            int stmpPort = int.Parse(_config["SmtpConfig:stmpPort"] ?? "0");

            if (!await IsDomainValidAsync(email))
            {
                Console.WriteLine("Invalid email domain.");
                return false;
            }

            try
            {
                MailMessage mail = new MailMessage();
                mail.To.Add(email ?? string.Empty);
                mail.From = new MailAddress(serverEmail);
                mail.Subject = subject;

                // Split the body text by line breaks
                string[] bodyLines = bodyText.Split(new[] { "\n" }, StringSplitOptions.None);

                string mailBody = "";

                foreach (string line in bodyLines)
                {
                    string updatedLine = line;

                    updatedLine = updatedLine.Replace("{{voucherValue}}", voucherValue.ToString());
                    updatedLine = updatedLine.Replace("{{voucherNumber}}", voucherNumber);
                    updatedLine = updatedLine.Replace("{{datetime}}", ExpirationDate.ToString("dddd, MMMM dd, yyyy hh:mm tt"));

                    if (updatedLine.Contains("CLAIM YOUR VOUCHER:"))
                    {
                        updatedLine = "<a href='" + App_url + "/register/?voucherNumber=" + voucherNumber + "' style='display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; font-weight: bold; border-radius: 5px;'>" + updatedLine + "</a>";
                    }
                    else
                    {
                        updatedLine = "<p>" + updatedLine + "</p>";
                    }

                    mailBody += updatedLine;
                }

                mail.Body = mailBody;
                mail.IsBodyHtml = true;

                SmtpClient smtp = new SmtpClient
                {
                    Port = stmpPort,
                    EnableSsl = true,
                    UseDefaultCredentials = false,
                    Host = stmpHost,
                    Credentials = new NetworkCredential(serverEmail, serverPassword)
                };

                await smtp.SendMailAsync(mail);
                return true;
            }
            catch (SmtpFailedRecipientException ex)
            {
                if (ex.StatusCode == SmtpStatusCode.MailboxUnavailable ||
                    ex.StatusCode == SmtpStatusCode.MailboxNameNotAllowed ||
                    ex.StatusCode == SmtpStatusCode.MailboxBusy)
                {
                    return false;
                }
                return false;
            }
            catch (SmtpException ex)
            {
                Console.WriteLine($"Failed to send email: SMTP error - {ex.Message}.");
                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send email: General error - {ex.Message}.");
                return false;
            }
        }
    }
}
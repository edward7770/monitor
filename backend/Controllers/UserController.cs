using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using Azure;
using System.Web;
using backend.Dtos.User;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Hangfire;
using backend.Dtos.ProspectVoucher;

namespace backend.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly ISmtpService _smtpService;
        private readonly IClientRepository _supplierRepo;
        private readonly IClientRepository _clientRepo;
        private readonly IClientBalanceRepository _clientBalanceRepo;
        private readonly IUserResetRepository _userResetRepo;
        private readonly IMonthlyBillCalculationServiceRepository _monthlyBillCalculationServiceRepo;
        private readonly IPricingRepository _pricingRepo;
        private readonly IProspectVoucherRepository _prospectVoucherRepo;
        private readonly SignInManager<AppUser> _signInManager;
        // private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IConfiguration _config;

        public UserController(UserManager<AppUser> userManager, IClientRepository supplierRepo, IClientRepository clientRepo, IUserResetRepository userResetRepo, ITokenService tokenService, ISmtpService smtpService, SignInManager<AppUser> signInManager, IClientBalanceRepository clientBalanceRepo, IMonthlyBillCalculationServiceRepository monthlyBillCalculationServiceRepo, IPricingRepository pricingRepo, IProspectVoucherRepository prospectVoucherRepo, IConfiguration config)
        {
            _userManager = userManager;
            _supplierRepo = supplierRepo;
            _clientRepo = clientRepo;
            _userResetRepo = userResetRepo;
            _tokenService = tokenService;
            _signInManager = signInManager;
            _clientBalanceRepo = clientBalanceRepo;
            _smtpService = smtpService;
            _pricingRepo = pricingRepo;
            _prospectVoucherRepo = prospectVoucherRepo;
            _monthlyBillCalculationServiceRepo = monthlyBillCalculationServiceRepo;
            // _httpContextAccessor = httpContextAccessor;
            _config = config;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = new List<UserDto>();
            var tempusers = await _userManager.Users.ToListAsync();
            foreach (var user in tempusers)
            {
                var roles = await _userManager.GetRolesAsync(user);
                var role = "";
                if (roles.Count != 0)
                {
                    foreach (var item in roles)
                    {
                        if (item != "Usermanagement")
                        {
                            role = item;
                        }
                    }
                }

                var client = await _clientRepo.GetByUserIdAsync(user.Id);

                var isUsermanagementRole = await _userManager.IsInRoleAsync(user, "Usermanagement");

                var tempuser = new UserDto
                {
                    UserId = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    Role = role,
                    UserManagement = isUsermanagementRole,
                    EmailConfirmed = user.EmailConfirmed,
                    Status = user.Status,
                    DateCreated = user.DateCreated,
                    Client = client,
                };

                users.Add(tempuser);
            }

            return Ok(users);
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUser(string userId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null) return StatusCode(403, "invalid_user_msg");

            var roles = await _userManager.GetRolesAsync(user);
            var role = "Client";
            if (roles.Count != 0)
            {
                foreach (var item in roles)
                {
                    if (item != "Usermanagement")
                    {
                        role = item;
                    }
                }
            }

            var clientBalance = await _clientBalanceRepo.GetClientBalanceByIdAsync(userId);

            var province = "";
            var client = await _clientRepo.GetByUserIdAsync(userId);
            if (role == "Client")
            {
                province = client.AddressLine4;
            }

            var isUsermanagementRole = await _userManager.IsInRoleAsync(user, "Usermanagement");
            var pricing = await _pricingRepo.GetPricingById(client.PricingId);

            return Ok(
                new NewUserDto
                {
                    UserId = user.Id,
                    UserName = user.Name,
                    Email = user.Email,
                    Token = _tokenService.CreateToken(user),
                    Role = role,
                    EmailConfirmed = user.EmailConfirmed,
                    UserManagement = isUsermanagementRole,
                    Status = user.Status,
                    Province = province,
                    BalanceId = clientBalance.Id,
                    BalanceType = clientBalance.Type,
                    BalanceAmount = clientBalance.Balance,
                    PricingId = client.PricingId,
                    PriceListId = client.PriceListId,
                    Price = pricing.Price
                }
            );
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var username = registerDto.Email.Replace("@", "AT");
                var emailConfirmed = false;

                if (registerDto.Role == "Admin")
                {
                    emailConfirmed = true;
                }

                var appUser = new AppUser
                {
                    Name = registerDto.Username,
                    UserName = username,
                    Email = registerDto.Email,
                    PhoneNumber = registerDto.Phone,
                    EmailConfirmed = emailConfirmed,
                    Status = 1
                };

                var existUser = await _userManager.Users.FirstOrDefaultAsync(x => x.Email == appUser.Email);

                if (existUser != null)
                {
                    return StatusCode(409, "That email already exists.");
                }

                var createdUser = await _userManager.CreateAsync(appUser, registerDto.Password);

                if (createdUser.Succeeded)
                {
                    var newClientBalance = new ClientBalance
                    {
                        ClientId = appUser.Id,
                        Type = "prepaid",
                        Balance = 5000,
                    };

                    var createClientBalance = await _clientBalanceRepo.AddAsync(newClientBalance);

                    if (createClientBalance != null)
                    {
                        if (registerDto.Role != "User")
                        {
                            var roleResult = await _userManager.AddToRoleAsync(appUser, registerDto.Role);

                            if (roleResult.Succeeded)
                            {
                                var token = await _userManager.GenerateEmailConfirmationTokenAsync(appUser);
                                // var confirmationLink = Url.Action(nameof(ConfirmEmail), "User", new { code, userId = appUser.Id}, Request.Scheme);
                                var confirmationLink = "http://www.superlinq.com:2000/confirm-email?token=" + token + "&userId=" + appUser.Id + "&email=" + appUser.Email;

                                var emailSent = await _smtpService.ActivateMailbySmtp(appUser.Email, appUser.Name, confirmationLink);
                                if (!emailSent)
                                {
                                    return StatusCode(500, new { Status = "Error", Message = "mail_send_fail_msg" });
                                }

                                DateTime registrationDate = appUser.DateCreated;
                                ScheduleBillCalculationJob(appUser.Id, registrationDate);

                                // return Ok("Successfully registered and sent activation email");
                                return Ok(
                                    new NewUserDto
                                    {
                                        UserId = appUser.Id,
                                        UserName = appUser.Name,
                                        Email = appUser.Email,
                                        BalanceId = createClientBalance.Id
                                    }
                                );
                            }
                            else
                            {
                                return BadRequest(roleResult.Errors);
                            }
                        }
                        else
                        {
                            var token = await _userManager.GenerateEmailConfirmationTokenAsync(appUser);
                            var confirmationLink = "http://www.superlinq.com:2000/confirm-email?token=" + token + "&userId=" + appUser.Id + "&email=" + appUser.Email;
                            var emailSent = await _smtpService.ActivateMailbySmtp(appUser.Email, appUser.Name, confirmationLink);
                            if (!emailSent)
                            {
                                return StatusCode(500, new { Status = "Error", Message = "mail_send_fail_msg" });
                            }

                            return Ok(
                                new NewUserDto
                                {
                                    UserId = appUser.Id,
                                    UserName = appUser.Name,
                                    Email = appUser.Email,
                                    BalanceId = createClientBalance.Id
                                }
                            );
                        }
                    } else
                    {
                        return BadRequest("Failed to create client balance");
                    }

                }
                else
                {
                    return BadRequest(createdUser.Errors);
                }
            }
            catch (System.Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost("register-voucher")]
        public async Task<IActionResult> RegisterWithVoucher([FromBody] RegisterWithVoucherDto registerWithVoucherDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var username = registerWithVoucherDto.Email.Replace("@", "AT");
                var emailConfirmed = false;

                if (registerWithVoucherDto.Role == "Admin")
                {
                    emailConfirmed = true;
                }

                var prospectVoucher = await _prospectVoucherRepo.GetProspectVoucherByNumberAsync(registerWithVoucherDto.VoucherNumber);

                if (prospectVoucher == null)
                {
                    return NotFound("Voucher not found.");
                }

                if (DateTime.Now > prospectVoucher.ExpirationDate)
                {
                    return BadRequest("Sorry, your voucher has expired.");
                }

                var appUser = new AppUser
                {
                    Name = registerWithVoucherDto.Username,
                    UserName = username,
                    Email = registerWithVoucherDto.Email,
                    PhoneNumber = registerWithVoucherDto.Phone,
                    EmailConfirmed = emailConfirmed,
                    Status = 1
                };

                var existUser = await _userManager.Users.FirstOrDefaultAsync(x => x.Email == appUser.Email);

                if (existUser != null)
                {
                    return StatusCode(409, "That email already exists.");
                }

                var createdUser = await _userManager.CreateAsync(appUser, registerWithVoucherDto.Password);

                if (createdUser.Succeeded)
                {
                    var newClientBalance = new ClientBalance
                    {
                        ClientId = appUser.Id,
                        Type = "prepaid",
                        Balance = prospectVoucher.VoucherValue,
                    };

                    var createClientBalance = await _clientBalanceRepo.AddAsync(newClientBalance);

                    if (createClientBalance != null)
                    {
                        await _prospectVoucherRepo.UpdateClaimEventAsync(prospectVoucher.ProspectVoucherListId, prospectVoucher.Id);

                        if (registerWithVoucherDto.Role != "User")
                        {
                            var roleResult = await _userManager.AddToRoleAsync(appUser, registerWithVoucherDto.Role);

                            if (roleResult.Succeeded)
                            {
                                var token = await _userManager.GenerateEmailConfirmationTokenAsync(appUser);
                                // var confirmationLink = Url.Action(nameof(ConfirmEmail), "User", new { code, userId = appUser.Id}, Request.Scheme);
                                var confirmationLink = "http://www.superlinq.com:2000/confirm-email?token=" + token + "&userId=" + appUser.Id + "&email=" + appUser.Email;

                                var emailSent = await _smtpService.ActivateMailbySmtp(appUser.Email, appUser.Name, confirmationLink);
                                if (!emailSent)
                                {
                                    return StatusCode(500, new { Status = "Error", Message = "mail_send_fail_msg" });
                                }

                                DateTime registrationDate = appUser.DateCreated;
                                ScheduleBillCalculationJob(appUser.Id, registrationDate);

                                return Ok(
                                    new NewUserDto
                                    {
                                        UserId = appUser.Id,
                                        UserName = appUser.Name,
                                        Email = appUser.Email,
                                        BalanceId = createClientBalance.Id
                                    }
                                );
                            }
                            else
                            {
                                return BadRequest(roleResult.Errors);
                            }
                        }
                        else
                        {
                            var token = await _userManager.GenerateEmailConfirmationTokenAsync(appUser);
                            var confirmationLink = "http://www.superlinq.com:2000/confirm-email?token=" + token + "&userId=" + appUser.Id + "&email=" + appUser.Email;
                            var emailSent = await _smtpService.ActivateMailbySmtp(appUser.Email, appUser.Name, confirmationLink);
                            if (!emailSent)
                            {
                                return StatusCode(500, new { Status = "Error", Message = "mail_send_fail_msg" });
                            }

                            return Ok(
                                new NewUserDto
                                {
                                    UserId = appUser.Id,
                                    UserName = appUser.Name,
                                    Email = appUser.Email,
                                    BalanceId = createClientBalance.Id
                                }
                            );
                        }
                    } else
                    {
                        return BadRequest("Failed to create client balance");
                    }

                }
                else
                {
                    return BadRequest(createdUser.Errors);
                }
            }
            catch (System.Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost("update-voucher-click")]
        public async Task<IActionResult> UpdateVoucherClickEvent([FromBody] UpdateVoucherClickEventDto updateVoucherClickEventDto)
        {
            var prospectVoucher = await _prospectVoucherRepo.GetProspectVoucherByNumberAsync(updateVoucherClickEventDto.VoucherNumber);

            if (prospectVoucher == null)
            {
                return NotFound("Voucher not found.");
            }

            if (DateTime.Now > prospectVoucher.ExpirationDate)
            {
                return BadRequest("Sorry, your voucher has expired.");
            }

            await _prospectVoucherRepo.UpdateClickEventAsync(prospectVoucher.ProspectVoucherListId, prospectVoucher.Id);

            return Ok(prospectVoucher);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Email == loginDto.Email);

            if (user == null) return StatusCode(403, "invalid_email_msg");

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (!result.Succeeded)
            {
                return StatusCode(403, "login_password_fail_msg");
            }

            var roles = await _userManager.GetRolesAsync(user);
            var role = "Client";
            if (roles.Count != 0)
            {
                foreach (var item in roles)
                {
                    if (item != "Usermanagement")
                    {
                        role = item;
                    }
                }
            }

            var isUsermanagementRole = await _userManager.IsInRoleAsync(user, "Usermanagement");

            if (role == null)
            {
                return BadRequest("Role doesn't exist!");
            }

            var clientBalance = await _clientBalanceRepo.GetClientBalanceByIdAsync(user.Id);

            return Ok(
                new NewUserDto
                {
                    UserId = user.Id,
                    UserName = user.Name,
                    Email = user.Email,
                    Token = _tokenService.CreateToken(user),
                    Role = role,
                    EmailConfirmed = user.EmailConfirmed,
                    UserManagement = isUsermanagementRole,
                    BalanceId = clientBalance.Id,
                    BalanceType = clientBalance.Type,
                    BalanceAmount = clientBalance.Balance,
                    Status = user.Status
                }
            );
        }

        [HttpPost("forgotPassword")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotDto forgotUser)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Email == forgotUser.Email);

            if (user == null)
            {
                return BadRequest("invalid_email_msg");
            }

            if (user.EmailConfirmed == false)
            {
                return StatusCode(403, "activation_alert_msg");
            }

            // send email to the client
            try
            {
                Random rand = new Random();
                int forgot_otp = rand.Next(100000000, 999999999);
                // var token = await _userManager.GeneratePasswordResetTokenAsync(user);

                user.forgot_otp = forgot_otp.ToString();
                await _userManager.UpdateAsync(user);

                // var httpContext = _httpContextAccessor.HttpContext;
                // var ipAddress = HttpContext.GetServerVariable("HTTP_X_FORWARDED_FOR");
                var ipAddress = Response.HttpContext.Connection.RemoteIpAddress.ToString();

                var userReset = new UserReset
                {
                    UserId = user.Id,
                    Key = forgot_otp.ToString(),
                    DateRequested = DateTime.Now,
                    IPAddress = ipAddress
                };

                var newUserReset = await _userResetRepo.AddAsync(userReset);
                if (newUserReset == null)
                {
                    return StatusCode(404, "forgot_password_fail_msg");
                }

                await _smtpService.ForgotPasswordMailBySmtp(forgot_otp.ToString(), user.Email, user.Name);

                return Ok("send_email_success_msg");
            }
            catch (System.Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        [HttpPost("resetPassword")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto resetUser)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = await _userManager.Users.FirstOrDefaultAsync(x => x.forgot_otp == resetUser.forgot_otp);
            if (user == null)
            {
                return StatusCode(404, "user_no_exist_msg");
            }

            var userReset = await _userResetRepo.GetUserResetByUserId(user.Id);

            if (userReset.DateRequested.AddMinutes(30) < DateTime.Now)
            {
                return StatusCode(403, "forgot_password_expired_msg");
            }

            var newPasswordHash = _userManager.PasswordHasher.HashPassword(user, resetUser.password);

            user.forgot_otp = "";
            user.PasswordHash = newPasswordHash;
            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded)
            {
                return Ok(user);
            }

            return BadRequest(result.Errors);
        }

        [HttpGet("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(string token, string userId, string email)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return StatusCode(404, new { Status = "Error", Message = "user_no_exist_msg" });
            }

            user.Email = email;
            user.UserName = email.Replace("@", "AT");

            await _userManager.UpdateAsync(user);

            var result = await _userManager.ConfirmEmailAsync(user, token);

            if (!result.Succeeded)
            {
                return StatusCode(403, new { Status = "Error", Message = "email_confirm_fail_msg" });
            }

            var roles = await _userManager.GetRolesAsync(user);
            var role = "Client";
            if (roles.Count != 0)
            {
                role = roles[0];
            }

            var isUsermanagementRole = await _userManager.IsInRoleAsync(user, "Usermanagement");

            DateTime defaultDateTime = DateTime.MinValue;

            if (role == "Supplier")
            {
                var findSupplier = await _supplierRepo.GetByUserIdAsync(userId);

                if (findSupplier == null)
                {
                    return StatusCode(404, new { Status = "Error", Message = "supplier_not_found" });
                }

                // if (findSupplier.DateActivated != defaultDateTime)
                // {
                //     return StatusCode(403, new { Status = "Error", Message = "email_confirm_valid_msg" });
                // }

                await _supplierRepo.UpdateApprovedDate(userId);

            }
            else if (role == "Client")
            {
                var findClient = await _clientRepo.GetByUserIdAsync(userId);

                if (findClient == null)
                {
                    return StatusCode(404, new { Status = "Error", Message = "client_not_found" });
                }

                // if (findClient.DateActivated != defaultDateTime)
                // {
                //     return StatusCode(403, new { Status = "Error", Message = "email_confirm_valid_msg" });
                // }
                await _clientRepo.UpdateApprovedDate(userId);
            }

            var clientBalance = await _clientBalanceRepo.GetClientBalanceByIdAsync(user.Id);

            return Ok(
                new NewUserDto
                {
                    UserId = user.Id,
                    UserName = user.Name,
                    Email = user.Email,
                    Token = _tokenService.CreateToken(user),
                    Role = role,
                    EmailConfirmed = user.EmailConfirmed,
                    UserManagement = isUsermanagementRole,
                    BalanceId = clientBalance.Id,
                    BalanceType = clientBalance.Type,
                    BalanceAmount = clientBalance.Balance,
                    Status = user.Status
                }
            );
        }

        [HttpGet("resend-email")]
        public async Task<IActionResult> ResendEmail(string userId, string email)
        {
            var user = await _userManager.FindByIdAsync(userId);
            var findUser = await _userManager.Users.FirstOrDefaultAsync(x => x.Email == email);

            if (findUser != null && user.Email != email)
            {
                // return StatusCode(404, new { Status = "Error", Message = "User with " + email + " is already registered!" });
                return StatusCode(404, new { Status = "Error", Message = "user_exist_msg" });
            }

            if (user == null)
            {
                return StatusCode(404, new { Status = "Error", Message = "user_no_exist_msg" });
            }

            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var confirmationLink = "http://www.superlinq.com:2000/confirm-email?token=" + token + "&userId=" + user.Id + "&email=" + email;

            var emailSent = await _smtpService.ActivateMailbySmtp(email, user.Name, confirmationLink);
            if (!emailSent)
            {
                return StatusCode(500, new { Status = "Error", Message = "mail_send_fail_msg" });
            }

            return Ok("resend_mail_success_msg");
        }


        [HttpPost("toggle-status")]
        public async Task<IActionResult> ToggleUserStatus([FromBody] UserDto userDto)
        {
            var user = await _userManager.FindByIdAsync(userDto.UserId);
            if (user == null)
            {
                return StatusCode(404, new { Status = "Error", Message = "user_no_exist_msg" });
            }
            user.Status = userDto.Status;

            await _userManager.UpdateAsync(user);
            return Ok(user);
        }

        [HttpPost("toggle-userrole")]
        public async Task<IActionResult> ToggleUserRole([FromBody] ToggleUserRoleDto userDto)
        {
            var user = await _userManager.FindByIdAsync(userDto.UserId);
            if (user == null)
            {
                return StatusCode(404, new { Status = "Error", Message = "user_no_exist_msg" });
            }

            if (userDto.CurrentRoleStatus == true)
            {
                var roleResult1 = await _userManager.AddToRoleAsync(user, userDto.RoleName);
                if (!roleResult1.Succeeded)
                {
                    return BadRequest("update_role_fail_msg");
                }
                return Ok(user);
            }

            var roleResult2 = await _userManager.RemoveFromRoleAsync(user, userDto.RoleName);
            if (!roleResult2.Succeeded)
            {
                return BadRequest("remove_role_fail_msg");
            }
            return Ok(user);
        }

        [NonAction]
        private void ScheduleBillCalculationJob(string clientId, DateTime registrationDate)
        {
            DateTime firstRunDate = registrationDate.AddMonths(1);

            RecurringJob.AddOrUpdate(
                $"process-matches-for-client-{clientId}",
                () => _monthlyBillCalculationServiceRepo.ProcessMonthlyCalculation(clientId),
                Cron.Monthly(firstRunDate.Day),
                TimeZoneInfo.Local
            );
        }
    }
}
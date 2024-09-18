using backend.Data;
using backend.Interfaces;
using backend.Models;
using backend.Service;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Microsoft.OpenApi.Models;
using backend.Repository;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.FileProviders;
using Hangfire;
using Hangfire.MemoryStorage;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSwaggerGen(option =>
{
    option.SwaggerDoc("v1", new OpenApiInfo { Title = "Demo API", Version = "v1" });
    option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter a valid token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });
    option.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type=ReferenceType.SecurityScheme,
                    Id="Bearer"
                }
            },
            new string[]{}
        }
    });
});

builder.Services.AddDbContext<ApplicationDBContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddDbContext<FormDataDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("FormRecordDataConnection"), options =>
        {
            options.CommandTimeout(180); // Timeout in seconds
        });
});

builder.Services.AddIdentity<AppUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredLength = 8;
})
.AddEntityFrameworkStores<ApplicationDBContext>().AddDefaultTokenProviders(); ;

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme =
    options.DefaultChallengeScheme =
    options.DefaultForbidScheme =
    options.DefaultScheme =
    options.DefaultSignInScheme =
    options.DefaultSignOutScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["JWT:Issuer"],
        ValidateAudience = true,
        ValidAudience = builder.Configuration["JWT:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            System.Text.Encoding.UTF8.GetBytes(builder.Configuration["JWT:SigningKey"])
        )
    };
});

builder.Services.AddAuthorization();

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
});

builder.Services.AddHttpContextAccessor();

builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<ISmtpService, SmtpService>();
builder.Services.AddScoped<IClientRepository, ClientRepository>();
builder.Services.AddScoped<IUserResetRepository, UserResetRepository>();
builder.Services.AddScoped<IFormDataRepository, FormDataRepository>();
builder.Services.AddScoped<IMatchRepository, MatchRepository>();
builder.Services.AddScoped<IMatchDataRepository, MatchDataRepository>();
builder.Services.AddScoped<IMatchResultRepository, MatchResultRepository>();
builder.Services.AddScoped<IClientBalanceRepository, ClientBalanceRepository>();
builder.Services.AddScoped<IClientTransactionRepository, ClientTransactionRepository>();

// builder.Services.AddHostedService<LongRunningTaskService>();
builder.Services.AddHangfire(config => config.UseMemoryStorage());
builder.Services.AddHangfireServer();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseForwardedHeaders();

// app.UseStaticFiles(new StaticFileOptions
// {
//     FileProvider = new PhysicalFileProvider(
//            Path.Combine(builder.Environment.ContentRootPath, "Uploads")),
//     RequestPath = "/Uploads"
// });

// Use Hangfire Dashboard (optional, good for debugging background jobs)
app.UseHangfireDashboard();


app.UseCors(x => x
    .AllowAnyMethod()
    .AllowAnyHeader()
    .AllowCredentials()
    .SetIsOriginAllowed(origin => true)
);

app.UseAuthentication();
app.UseAuthorization();

app.Use(async (context, next) =>
{
    var path = context.Request.Path.Value;

    if (path.StartsWith("/Uploads") && !context.User.Identity.IsAuthenticated)
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        await context.Response.WriteAsync("Unauthorized access. Please log in to download files.");
        return;
    }

    // Continue processing the request
    await next.Invoke();
});

// Serve static files from the Uploads directory
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
           Path.Combine(builder.Environment.ContentRootPath, "Uploads")),
    RequestPath = "/Uploads"
});

app.MapControllers();

app.Run();
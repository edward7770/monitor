using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;

namespace backend.Data
{
    public class ApplicationDBContext : IdentityDbContext<AppUser>
    {
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options)
        : base(options)
        {

        }

        public DbSet<Client> Clients { get; set; }
        public DbSet<UserReset> UserResets { get; set; }
        public DbSet<Match> Matches { get; set; }
        public DbSet<MatchData> MatchDatas { get; set; }
        public DbSet<MatchResult> MatchResults { get; set; }
        public DbSet<ClientBalance> ClientBalances { get; set; }
        public DbSet<ClientTransaction> ClientTransactions { get; set; }
        public DbSet<ClientPayment> ClientPayments { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<IdentityRole>().HasData(
                    new IdentityRole
                    {
                        Id = Guid.NewGuid().ToString(),
                        Name = "Superadmin",
                        NormalizedName = "SUPERADMIN"
                    },
                    new IdentityRole
                    {
                        Id = Guid.NewGuid().ToString(),
                        Name = "Client",
                        NormalizedName = "CLIENT"
                    }
                );
            builder.Entity<Client>()
                .HasOne(c => c.AppUser)
                .WithOne(u => u.Client)
                .HasForeignKey<Client>(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ClientBalance>()
                .HasOne(c => c.AppUser)
                .WithOne(cb => cb.ClientBalance)
                .HasForeignKey<ClientBalance>(cb => cb.ClientId)
                .OnDelete(DeleteBehavior.Cascade);
                
            builder.Entity<ClientBalance>()
                 .HasMany(b => b.Transactions)
                 .WithOne(t => t.ClientBalance)
                 .HasForeignKey(t => t.BalanceId);

            builder.Entity<ClientBalance>()
                .HasMany(b => b.Payments)
                .WithOne(p => p.ClientBalance)
                .HasForeignKey(p => p.BalanceId);

            builder.Entity<Match>()
                .HasMany(m => m.MatchDatas)
                .WithOne(p => p.Match)
                .HasForeignKey(p => p.MatchId);

            builder.Entity<Match>()
                .HasMany(m => m.MatchResult)
                .WithOne(p => p.Match)
                .HasForeignKey(p => p.MatchId);

            builder.Entity<AppUser>()
                .HasMany(u => u.Matches)
                .WithOne(m => m.AppUser)
                .HasForeignKey(m => m.ClientId)
                .OnDelete(DeleteBehavior.Cascade); 
        }
    }

    public class FormDataDbContext : DbContext
    {
        public FormDataDbContext(DbContextOptions<FormDataDbContext> options) : base(options) { }
        public DbSet<J187FormRecord> J187FormRecords { get; set; }
        public DbSet<J193FormRecord> J193FormRecords { get; set; }
    }
}
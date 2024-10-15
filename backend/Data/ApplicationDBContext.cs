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
        public DbSet<SearchLog> SearchLogs { get; set; }
        public DbSet<Pricing> Pricings { get; set; }
        public DbSet<XJ187> XJ187s { get; set; }
        public DbSet<XJ193> XJ193s { get; set; }
        public DbSet<Import> Imports { get; set; }
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

            builder.Entity<XJ193>()
                .ToTable("xJ193")
                .HasIndex(x => x.IdNo)
                .HasDatabaseName("IX_XJ193_IdNo");

            builder.Entity<XJ187>()
                .ToTable("xJ187")
                .HasIndex(x => x.IdNo)
                .HasDatabaseName("IX_XJ187_IdNo");

            builder.Entity<MatchData>()
                .HasIndex(x => x.IdNumber)
                .HasDatabaseName("IX_MatchData_IdNo");

            builder.Entity<Pricing>().HasData(
                new Pricing { Id = 1, List = 1, ListName = "Default", Tier = 1, Description = "1-99", Start = 1, End = 99, Price = 199 },
                new Pricing { Id = 2, List = 1, ListName = "Default", Tier = 2, Description = "100-199", Start = 100, End = 199, Price = 189 },
                new Pricing { Id = 3, List = 1, ListName = "Default", Tier = 3, Description = "200-499", Start = 200, End = 499, Price = 149 },
                new Pricing { Id = 4, List = 1, ListName = "Default", Tier = 4, Description = "500-999", Start = 500, End = 999, Price = 129 },
                new Pricing { Id = 5, List = 1, ListName = "Default", Tier = 5, Description = "1000-999999", Start = 1000, End = 999999, Price = 99 }
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

            builder.Entity<AppUser>()
                .HasMany(c => c.SearchLogs)
                .WithOne(u => u.AppUser)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Client>()
                .HasOne(c => c.Pricing)
                .WithMany()
                .HasForeignKey(c => c.PricingId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }

    public class FormDataDbContext : DbContext
    {
        public FormDataDbContext(DbContextOptions<FormDataDbContext> options) : base(options) { }
        public DbSet<J187FormRecord> J187FormRecords { get; set; }
        public DbSet<J193FormRecord> J193FormRecords { get; set; }
    }
}
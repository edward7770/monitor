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
        public ApplicationDBContext(DbContextOptions dbContextOptions)
        : base(dbContextOptions)
        {
            
        }

        public DbSet<Brand> Brands { get; set; }
        public DbSet<Inverter> Inverters { get; set;}
        public DbSet<Panel> Panels{ get; set; }
        public DbSet<Solution> Solutions{ get; set; }
        public DbSet<SolutionDetail> SolutionDetails{ get; set; }
        public DbSet<Storage> Storages{ get; set; }
        public DbSet<Supplier> Suppliers{ get; set; }
        public DbSet<Review> Reviews{ get; set; }
        public DbSet<RejectedReason> RejectedReasons{ get; set;}
        public DbSet<Client> Clients { get; set;}
        public DbSet<UserReset> UserResets { get; set; }
        public DbSet<Documentation> Documentations { get; set; }
        public DbSet<SupplierUser>  SupplierUsers{ get; set; }
        public DbSet<Province> Provinces { get; set; }
        public DbSet<District> Districts { get; set; }
        public DbSet<SolutionProvince> SolutionProvinces { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            List<IdentityRole> roles = new List<IdentityRole>
            {
                new IdentityRole
                {
                    Name = "Superadmin",
                    NormalizedName = "SUPERADMIN"
                },
                new IdentityRole
                {
                    Name = "Admin",
                    NormalizedName = "ADMIN"
                },
                new IdentityRole
                {
                    Name = "Client",
                    NormalizedName = "CLIENT"
                },
                new IdentityRole
                {
                    Name = "Supplier",
                    NormalizedName = "SUPPLIER"
                },
                new IdentityRole
                {
                    Name = "Sales",
                    NormalizedName = "SALES"
                },
                new IdentityRole
                {
                    Name = "Usermanagement",
                    NormalizedName = "USERMANAGEMENT"
                }
            };
            builder.Entity<IdentityRole>().HasData(roles);
        }

    }
}
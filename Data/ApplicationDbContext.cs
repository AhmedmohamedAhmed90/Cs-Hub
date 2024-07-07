using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Cs_Hub.Models;

namespace Cs_Hub.Data
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
       public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {


        }

        public DbSet<Resourse> Resourses { get; set; }
        public DbSet<Category> Categories { get; set; }

        public DbSet<User> Users { get; set; }

        public DbSet<UserResourses> UserResourses { get; set; }


        protected override void OnModelCreating(ModelBuilder Builder)
        {
            base.OnModelCreating(Builder);
            List<IdentityRole> roles = new List<IdentityRole>
      {
           new IdentityRole
           {
            Name="Admin",
            NormalizedName="ADMIN",
           },
           new IdentityRole
           {
            Name="User",
            NormalizedName="USER",
           }
      };
            Builder.Entity<IdentityRole>().HasData(roles);

            /*protected override void OnModelCreating(ModelBuilder modelBuilder)
            {

                if (modelBuilder == null)
                {
                    throw new ArgumentNullException(nameof(modelBuilder));
                }
                modelBuilder.Entity<Resourse>()
                    .HasOne(b => b.Category)
                    .WithMany(a => a.Resourses)
                    .HasForeignKey("CategoryId");

            base.OnModelCreating(modelBuilder);
            }*/


        }
    }
}

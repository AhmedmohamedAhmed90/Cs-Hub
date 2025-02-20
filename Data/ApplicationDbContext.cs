using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Cs_Hub.Models;
using System.Collections.Generic;

namespace Cs_Hub.Data
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Resource> Resources { get; set; }
        public DbSet<ResourceCategory> ResourceCategories { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Review> Reviews { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Rename Identity Table from "AspNetUsers" to "Users"
            builder.Entity<User>().ToTable("Users");

            // Many-to-Many Relationship: Resources & Categories
            builder.Entity<ResourceCategory>()
                .HasKey(rc => new { rc.ResourceID, rc.CategoryID });

            builder.Entity<ResourceCategory>()
                .HasOne(rc => rc.Resource)
                .WithMany(r => r.ResourceCategories)
                .HasForeignKey(rc => rc.ResourceID)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ResourceCategory>()
                .HasOne(rc => rc.Category)
                .WithMany(c => c.ResourceCategories)
                .HasForeignKey(rc => rc.CategoryID)
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-Many: User → Resources (A user can upload multiple resources)
            builder.Entity<Resource>()
                .HasOne(r => r.User)
                .WithMany(u => u.Resources)
                .HasForeignKey(r => r.UserID)
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-Many: Resource → Comments (A resource can have multiple comments)
            builder.Entity<Comment>()
                .HasOne(c => c.Resource)
                .WithMany(r => r.Comments)
                .HasForeignKey(c => c.ResourceID)
                .OnDelete(DeleteBehavior.Cascade);

// One-to-Many: User → Comments (Disable Cascade Delete)
builder.Entity<Comment>()
    .HasOne(c => c.User)
    .WithMany(u => u.Comments)
    .HasForeignKey(c => c.UserID)
    .OnDelete(DeleteBehavior.NoAction); // Prevent cascading delete


            // One-to-Many: Resource → Reviews (A resource can have multiple reviews)
            builder.Entity<Review>()
                .HasOne(r => r.Resource)
                .WithMany(res => res.Reviews)
                .HasForeignKey(r => r.ResourceID)
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-Many: User → Reviews (A user can leave multiple reviews)
            builder.Entity<Review>()
                .HasOne(r => r.User)
                .WithMany(u => u.Reviews)
                .HasForeignKey(r => r.UserID)
                .OnDelete(DeleteBehavior.NoAction);

            // Seed Default Roles
            List<IdentityRole> roles = new List<IdentityRole>
            {
                new IdentityRole { Name = "Admin", NormalizedName = "ADMIN" },
                new IdentityRole { Name = "User", NormalizedName = "USER" }
            };
            builder.Entity<IdentityRole>().HasData(roles);
        }
    }
}

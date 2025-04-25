using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Cs_Hub.Models
{
    public class User : IdentityUser
    {
        //[Required]
        public string FullName { get; set; }

        public int? Age { get; set; }

        public string? Address { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public ICollection<Resource> Resources { get; set; } = new List<Resource>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}

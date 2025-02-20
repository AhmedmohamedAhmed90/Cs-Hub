using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System;
using System.Collections.Generic;


namespace Cs_Hub.Models

{
    public class User : IdentityUser
    {
       /* [Key]
        public int Id { get; set; }*/

       
       // public string UserName { get; set; }
        public string FullName { get; set; }

      
        public int Age { get; set; }

        
        public string Address { get; set; }

      
       // public string Email { get; set; }

    // Navigation property
    public ICollection<Comment> Comments { get; set; }
    public ICollection<Resource> Resources { get; set; }
    public ICollection<Review> Reviews { get; set; } = new List<Review>();

        //public string password { get; set; }


        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;


    }
}

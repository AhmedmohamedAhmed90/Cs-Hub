using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace Cs_Hub.Models
{
    public class User : IdentityUser
    {
       /* [Key]
        public int Id { get; set; }*/

       
       // public string UserName { get; set; }

      
        public int Age { get; set; }

        
        public string Address { get; set; }

      
       // public string Email { get; set; }

       
        //public string password { get; set; }

       
        public ICollection<UserResourses>? UserResourses { get; set; }


    }
}

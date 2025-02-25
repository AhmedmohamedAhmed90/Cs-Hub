using System.ComponentModel.DataAnnotations;

namespace Cs_Hub.Dtos
{
    public class Register
    {

        public string? FullName { get; set; }

        [Required]
        [EmailAddress]
        public string? Email { get; set; }
       
        public string? Password { get; set; }
        [StringLength(100)]
        public string? Address { get; set; }

        [Range(0, 150)]
        public int Age { get; set; }

       
    }
}

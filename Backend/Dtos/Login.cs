using System.ComponentModel.DataAnnotations;

namespace Cs_Hub.Dtos
{
    public class Login
    {
        //[Required]
        public String? Email { get; set; }
        //[Required]
        public String? Password { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;

namespace Cs_Hub.Dtos
{
    public class CreateCommentDto
    {
        [Required]
        public string UserID { get; set; }  

        [Required]
        public int ResourceID { get; set; }  

        [Required]
        [MinLength(1, ErrorMessage = "Content cannot be empty")]
        public string Content { get; set; }  
    }
}

using System.ComponentModel.DataAnnotations;

namespace Cs_Hub.Dtos
{
    public class CategoryCreateDto
    {

        [Required]
        public string Name { get; set; }


        [Required]

        public string Description { get; set; }
    }
}

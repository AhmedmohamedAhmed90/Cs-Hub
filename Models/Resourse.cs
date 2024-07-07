using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cs_Hub.Models
{
    public class Resourse
    {
        [Key]

        public int Id { get; set; }

        [Required]

        public string Name { get; set; }

        [Required]

        public string Description { get; set; }

        public string? Link { get; set; }

        public string? Image { get; set; }

        public string? Video { get; set; }

        public string Status { get; set; }

        public int CategoryId { get; set; }
        public Category Category { get; set; }

        public ICollection<UserResourses>? UserResourses { get; set; }








    }
}

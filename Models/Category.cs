using System.ComponentModel.DataAnnotations;

namespace Cs_Hub.Models
{
    public class Category
    {

        [Key]
        public int Id { get; set; }

        public  string  Name { get; set; }

        public ICollection<Resourse> Resourses { get; set; }
    }
}

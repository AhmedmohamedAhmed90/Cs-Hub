using System.ComponentModel.DataAnnotations;

namespace Cs_Hub.Models
{
    public class UserResourses
    {
        [Key]
        public int Id { get; set; }

       
        public int ResourseId { get; set; }
        public Resourse Resourse { get; set; }

       
        public int UserId { get; set; }
        public User User { get; set; }
    }
}

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Cs_Hub.Models
{ 
  public class Category
    {
        [Key]
        public int CategoryID { get; set; }

        [Required, MaxLength(100)]
        public string Name { get; set; }

        public string Description { get; set; }

        public ICollection<Resource> Resources { get; set; } = new List<Resource>();
    }
    }
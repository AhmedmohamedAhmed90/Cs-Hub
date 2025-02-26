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

    // Many-to-Many Relationship
    public ICollection<ResourceCategory>? ResourceCategories { get; set; }
}
    }
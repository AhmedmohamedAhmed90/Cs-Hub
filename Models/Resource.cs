using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cs_Hub.Models

{ 
public class Resource
{
    [Key]
    public int ResourceID { get; set; }

    [Required]
    [ForeignKey("User")]
    public string UserID { get; set; }
    public User User { get; set; }

    [Required, MaxLength(255)]
    public string Title { get; set; }

    public string Description { get; set; }

    [Required, MaxLength(20)]
    public string ResourceType { get; set; } // Video, PDF, Slides, Post, etc.

    public string URL { get; set; } // External link (e.g., YouTube, Google Drive)
    public string FilePath { get; set; } // File storage path (for PDFs, slides, etc.)

    [Required, MaxLength(20)]
    public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<ResourceCategory> ResourceCategories { get; set; }
    public ICollection<Comment> Comments { get; set; }
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }

}
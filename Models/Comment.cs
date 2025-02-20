using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cs_Hub.Data
{
    public class Comment
    {
        [Key]
        public int CommentID { get; set; }

        [Required]
        [ForeignKey("User")]
        public string UserID { get; set; }
        public User User { get; set; }

        [Required]
        [ForeignKey("Resource")]
        public int ResourceID { get; set; }
        public Resource Resource { get; set; }

        [Required]
        public string Content { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
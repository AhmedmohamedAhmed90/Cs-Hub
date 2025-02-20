using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cs_Hub.Data
{
	public class Review
	{
		[Key]
		public int ReviewID { get; set; }

		[Required]
		[ForeignKey("User")]
		public string UserID { get; set; }
		public User User { get; set; }

		[Required]
		[ForeignKey("Resource")]
		public int ResourceID { get; set; }
		public Resource Resource { get; set; }

		[Required]
		[Range(1, 5)]
		public int Rating { get; set; } // 1 to 5 stars


		public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
	}
}

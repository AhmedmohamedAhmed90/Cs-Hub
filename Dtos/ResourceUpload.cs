using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace Cs_Hub.Dtos
{
	public class ResourceUpload
	{
		[Required]
	//	[FromForm]
		public string Title { get; set; }

		[Required]
	//	[FromForm]
		public string Description { get; set; }

		[Required]
		//[FromForm]
		public string ResourceType { get; set; }

		//[FromForm]
		public string? URL { get; set; }  // Optional

		//[FromForm]
		public IFormFile? File { get; set; }

		[Required]
		//[FromForm]
		public int CategoryID { get; set; }
	}
}

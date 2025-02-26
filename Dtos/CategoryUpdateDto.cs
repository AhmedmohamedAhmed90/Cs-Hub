using System.ComponentModel.DataAnnotations;

namespace Cs_Hub.Dtos
{
    public class CategoryUpdateDto
    {
        public string? Name { get; set; }
        public string> Description { get; set; }
    }
}
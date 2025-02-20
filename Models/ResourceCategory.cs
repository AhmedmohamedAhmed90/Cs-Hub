using System.ComponentModel.DataAnnotations.Schema;


namespace Cs_Hub.Data
{
    public class ResourceCategory
    {
        public int ResourceID { get; set; }
        [ForeignKey("ResourceID")]
        public Resource Resource { get; set; }

        public int CategoryID { get; set; }
        [ForeignKey("CategoryID")]
        public Category Category { get; set; }
    }
}
namespace Cs_Hub.Dtos
{
    public class CreateReviewDto
    {
        public string UserID { get; set; }
        public int ResourceID { get; set; }
        public int Rating { get; set; }
    }

}

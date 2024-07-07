namespace Cs_Hub.Dtos
{
    public class NewUser
    {

        public string Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }

        public int Age { get; set; }

        public string Address { get; set; }

        public string Role { get; set; }

        public bool isAdmin { get; set; }

        public string Token { get; set; }
    }
}

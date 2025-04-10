﻿using System.ComponentModel.DataAnnotations;

namespace Cs_Hub.Dtos
{
    public class UserDto
    {

        public string Id { get; set; }
        public string? Username { get; set; }

            [Required]
            [EmailAddress]
            public string? Email { get; set; }

            [StringLength(100)]
            public string? Address { get; set; }

            [Range(0, 150)]
            public int Age { get; set; }


       




    }
    
}

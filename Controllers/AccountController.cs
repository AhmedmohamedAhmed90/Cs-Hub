using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cs_Hub.Dtos;
using Cs_Hub.Interfaces;
using Cs_Hub.Models;

namespace Cs_Hub.Controllers
{
    public class AccountController : ControllerBase
    {
        private readonly UserManager<User> visitor;
        private readonly ITokenService _TokenService;

        private readonly SignInManager<User> _signin;
        public AccountController(UserManager<User> userManager, ITokenService TokenService, SignInManager<User> signin)
        {
            visitor = userManager;
            _TokenService = TokenService;
            _signin = signin;

        }

        //[HttpPost("login")]
        public async Task<IActionResult> Login(Login login)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = await visitor.Users.FirstOrDefaultAsync(x => x.Email == login.Email!.ToLower());

            if (user == null) return Unauthorized("the user not found");

            var result = await _signin.CheckPasswordSignInAsync(user, login.Password!, false);

            if (!result.Succeeded) return Unauthorized("Invalid UserName and / or password");

            var roles = await visitor.GetRolesAsync(user);


            return Ok(
                new NewUser
                {
                    UserName = user.UserName,
                    Email = user.Email!,
                    Role = roles[0],
                    isAdmin = roles[0] == "Admin" ? true : false,
                    Id = user.Id,
                    Token = await _TokenService.CreateToken(user)
                }
            );
        }

        //[HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] Register registerDto)
        {
            try
            {
              
                var User = new User
                {
                   
                    UserName = registerDto.Email,
                    Email = registerDto.Email,
                    
                    Address = registerDto.Address,
                   
                    PasswordHash = registerDto.Password,
                   
                };
                var createUser = await visitor.CreateAsync(User, registerDto.Password!);
                if (createUser.Succeeded)
                {
                    var Result = await visitor.AddToRoleAsync(User, "User");
                    if (Result.Succeeded)
                    {
                        return Ok(new NewUser
                        {
                            Id = User.Id,
                            Email = User.Email!,
                            Role = "User",
                            isAdmin = false,
                  
                            Token = await _TokenService.CreateToken(User)
                        });
                    }
                    else
                    {
                        return StatusCode(500, Result.Errors);
                    }
                }
                else
                {
                    return StatusCode(500, createUser.Errors);
                }
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
     
       // [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _signin.SignOutAsync();
            return Ok("User logged out successfully");
        }


    }
}

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cs_Hub.Dtos;
using Cs_Hub.Interfaces;
using Cs_Hub.Models;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Cs_Hub.Data;

namespace Cs_Hub.Controllers
{
    public class AccountController : Controller
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

        public IActionResult Login()
        {
            return View();
        }

        public IActionResult Register()
        {
            return View();
        }

        [HttpPost]
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


            /* return Ok(
                 new NewUser
                 {
                     UserName = user.UserName,
                     Email = user.Email!,
                     Role = roles[0],
                     isAdmin = roles[0] == "Admin" ? true : false,
                     Id = user.Id,
                     Token = await _TokenService.CreateToken(user)
                 }
             );*/
            return RedirectToAction("Privacy", "Home");
        }

        //[HttpPost("register")]
        [HttpPost]
        public async Task<IActionResult> Register( Register registerDto)
        {
            Console.WriteLine("useeeeeeeeeeeeeeeeeeeeeeeer");
            Console.WriteLine(registerDto.Username);
            try
            {
              
                var User = new User
                {
                   
                    UserName = registerDto.Username,
                    Email = registerDto.Email,
                    
                    Address = registerDto.Address,

                    Age=registerDto.Age,
                   
                    PasswordHash = registerDto.Password,
                   
                };
                var createUser = await visitor.CreateAsync(User, registerDto.Password!);
                if (createUser.Succeeded)
                {
                    var Result = await visitor.AddToRoleAsync(User, "User");
                    if (Result.Succeeded)
                    {
                        /*return Ok(new NewUser
                        {
                            Id = User.Id,
                            Email = User.Email!,
                            Role = "User",
                            isAdmin = false,
                  
                            Token = await _TokenService.CreateToken(User)
                        });*/
                        return RedirectToAction("Login", "Account");
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

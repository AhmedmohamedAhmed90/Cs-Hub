using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cs_Hub.Dtos;
using Cs_Hub.Interfaces;
using Cs_Hub.Models;
using Cs_Hub.Data;
using System;
using System.Threading.Tasks;
using Cs_Hub.Validator;
using Microsoft.Win32;
using FluentValidation;
using System.Configuration;

namespace Cs_Hub.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly ITokenService _tokenService;
        private readonly SignInManager<User> _signInManager;
        private readonly IValidator<Register> _registervalidator;
        private readonly IValidator<Login> _loginvalidator;


        public AccountController(IValidator<Login> loginvalidator, IValidator<Register> registervalidator, UserManager<User> userManager, ITokenService tokenService, SignInManager<User> signInManager)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _signInManager = signInManager;
            _registervalidator = registervalidator;
            _loginvalidator = loginvalidator;
        }

        [HttpPost("login-user")]
        public async Task<IActionResult> Login([FromBody] Login login)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Invalid login request" });
            }

            var validationResult = _loginvalidator.Validate(login);
            if (!validationResult.IsValid)
            {
                var problemDetails = new HttpValidationProblemDetails(validationResult.ToDictionary())
                {
                    Status = StatusCodes.Status400BadRequest,
                    Title = "Validation failed",
                    Detail = "One or more validation errors occured",
                    Instance = "/api/account/register"
                };
                return BadRequest(Results.Problem(problemDetails));
            }

            var user = await _userManager.FindByEmailAsync(login.Email!.ToLower());

            if (user == null)
                return NotFound(new { message = "User not found" });

            var result = await _signInManager.CheckPasswordSignInAsync(user, login.Password!, false);

            if (!result.Succeeded)
                return Unauthorized(new { message = "Incorrect password" });

            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new NewUser
            {
                FullName = user.FullName,
                Email = user.Email!,
                Role = roles.Count > 0 ? roles[0] : "User",
                isAdmin = roles.Contains("Admin"),
                Id = user.Id,
                Age = (int)user.Age,
                Address = user.Address,
                Token = await _tokenService.CreateToken(user)
            });
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register(Register registerDto)
        {
            Console.WriteLine("Registering user...");
            Console.WriteLine(registerDto.FullName);

            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid registration data", errors = ModelState.Values.SelectMany(v => v.Errors) });
                }

                var user = new User
                {
                    FullName = registerDto.FullName,
                    UserName = registerDto.Email?.Split('@')[0], // Use email prefix as username
                    Email = registerDto.Email,
                    Address = registerDto.Address,
                    Age = (int)registerDto.Age
                };

                var createUser = await _userManager.CreateAsync(user, registerDto.Password);
                if (!createUser.Succeeded)
                {
                    return BadRequest(new { message = "User registration failed", errors = createUser.Errors });
                }

                var roleResult = await _userManager.AddToRoleAsync(user, "User");
                if (!roleResult.Succeeded)
                {
                    return StatusCode(500, new { message = "Role assignment failed", errors = roleResult.Errors });
                }

                return Ok(new { message = "User registered successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }



        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok(new { message = "User logged out successfully" });
        }




    }
}
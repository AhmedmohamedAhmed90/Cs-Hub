using Microsoft.AspNetCore.Mvc;
using Cs_Hub.Dtos;
using Cs_Hub.Models;
using Cs_Hub.Data;
using Microsoft.AspNetCore.Identity;
using Cs_Hub.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;

namespace Cs_Hub.Controllers
{
    public class UserController:Controller
    {
        readonly ApplicationDbContext _DbContext;

        private readonly UserManager<User> _userManager;
        private readonly ITokenService _TokenService;

        private readonly SignInManager<User> _signin;
        public UserController(ApplicationDbContext DbContext, UserManager<User> userManager, ITokenService TokenService, SignInManager<User> signin)
        {
            _DbContext = DbContext;
            _userManager = userManager;
            _TokenService = TokenService;
            _signin = signin;
        }

        public async Task<IActionResult> EditUser(string Id, [FromBody] dynamic formData)
        {
            User user = _DbContext.Users.Where(x => x.Id == Id).First();
            user.Age = formData.Age;
            user.Address = formData.Address;

            await _DbContext.SaveChangesAsync();

            return RedirectToAction("Index", "Home");



        }

        public async Task<IActionResult> PromoteToAdmin(string Id)
        {
            var userId = Id;
            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest("UserId is required");
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            var currentRoles = await _userManager.GetRolesAsync(user);
            var removeRolesResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
            if (!removeRolesResult.Succeeded)
            {
                return StatusCode(500, "Failed to remove current roles");
            }

            var addRoleResult = await _userManager.AddToRoleAsync(user, "Admin");
            if (addRoleResult.Succeeded)
            {
                return RedirectToAction("GetAllUsers");
            }
            else
            {
                return StatusCode(500, "Failed to add Admin role");
            }
        }


        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {

            var users = await _userManager.Users
             .Select(u => new UserDto
             {
                 Username = u.UserName,
                 Email = u.Email,
                 Age = u.Age,
                 Address = u.Address,
                 Id = u.Id
             })
             .ToListAsync();

            return View(users);

        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest("User ID is required");
            }

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound("User not found");
            }

            return RedirectToAction("Index", "Home");

        }


        [HttpPost]
        public async Task<IActionResult> DeleteUser(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest("User ID is required");
            }

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound("User not found");
            }

            var result = await _userManager.DeleteAsync(user);
            
                return RedirectToAction("GetAllUsers");
            
        }






        }

}

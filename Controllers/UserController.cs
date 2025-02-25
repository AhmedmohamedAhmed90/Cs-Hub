using Microsoft.AspNetCore.Mvc;
using Cs_Hub.Dtos;
using Cs_Hub.Models;
using Cs_Hub.Data;
using Microsoft.AspNetCore.Identity;
using Cs_Hub.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Linq;

namespace Cs_Hub.Controllers
{
    [Route("api/users")]  
    [ApiController]        
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _DbContext;
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

        [HttpPut("edit-user/{id}")]
        public async Task<IActionResult> EditUser(string id, [FromBody] EditUserDto formData)
        {
            var user = await _DbContext.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            user.Age = formData.Age;
            user.FullName = formData.FullName;
            user.Address = formData.Address;

            await _DbContext.SaveChangesAsync();

            return Ok(new { message = "User updated successfully", user });
        }

        [HttpPost("{id}/promote")]
        public async Task<IActionResult> PromoteToAdmin(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest(new { message = "UserId is required" });
            }

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var currentRoles = await _userManager.GetRolesAsync(user);
            var removeRolesResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
            if (!removeRolesResult.Succeeded)
            {
                return StatusCode(500, new { message = "Failed to remove current roles" });
            }

            var addRoleResult = await _userManager.AddToRoleAsync(user, "Admin");
            if (!addRoleResult.Succeeded)
            {
                return StatusCode(500, new { message = "Failed to add Admin role" });
            }

            return Ok(new { message = "User promoted to Admin successfully" });
        }

        [HttpGet("all-users")]
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

            return Ok(users);
        }

        [HttpGet("user-by-id/{id}")]
        public async Task<IActionResult> GetUserById(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest(new { message = "User ID is required" });
            }

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(user);
        }

        [HttpDelete("delete-user/{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest(new { message = "User ID is required" });
            }

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                return StatusCode(500, new { message = "Failed to delete user" });
            }

            return Ok(new { message = "User deleted successfully" });
        }
    }
}

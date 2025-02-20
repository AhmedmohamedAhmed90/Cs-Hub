using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Cs_Hub.Interfaces;
using Cs_Hub.Models;
using Cs_Hub.Data;

namespace Cs_Hub.Services
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _config;
        private readonly SymmetricSecurityKey _key;
        private readonly UserManager<User> _userManager;

        public TokenService(IConfiguration config, UserManager<User> userManager)
        {
            _config = config ?? throw new ArgumentNullException(nameof(config));
            _userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
            var signingKey = _config["JWT:SigningKey"];
            if (string.IsNullOrEmpty(signingKey))
            {
                throw new ArgumentException("JWT Signing Key is not configured.");
            }
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(signingKey));
        }

        public async Task<string> CreateToken(User User)
        {
            if (User == null)
            {
                throw new ArgumentNullException(nameof(User));
            }

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Email, User.Email),
                new Claim(JwtRegisteredClaimNames.GivenName, User.UserName),
                new Claim(JwtRegisteredClaimNames.NameId, User.Id)
            };

            // Get user roles and add them as claims
            var roles = await _userManager.GetRolesAsync(User);
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(7), // Use UTC for consistency
                SigningCredentials = creds,
                Issuer = _config["JWT:Issuer"],
                Audience = _config["JWT:Audience"],
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

     
    }
}

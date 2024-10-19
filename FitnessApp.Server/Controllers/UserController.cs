using FitnessApp.Server.Models;
using FitnessApp.Server.Models.Update;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace FitnessApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;

        public UserController(UserManager<User> userManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _configuration = configuration;
        }

        // User Registration
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] Register model)
        {
            if (model.Password != model.ConfirmPassword)
            {
                return BadRequest(new { Message = "Passwords do not match" });
            }

            var user = new User { UserName = model.Email, Email = model.Email, Calories = model.calorieIntake ?? 0 };
            var result = await _userManager.CreateAsync(user, model.Password);
            if (result.Succeeded)
            {
                return Ok(new { Message = "User registered successfully" });
            }

            return BadRequest(result.Errors);
        }


        // User Login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Login model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                var token = GenerateJwtToken(user);
                return Ok(new
                {
                    Id = user.Id,
                    Email = user.Email,
                    Calories = user.Calories, 
                    Token = token
                });
            }
            return Unauthorized("Invalid login attempt.");
        }

        [HttpPut("update-calories")]
        public async Task<IActionResult> UpdateCalories([FromBody] UpdateCalories model)
        {
            if (string.IsNullOrEmpty(model.User_Id))
            {
                return BadRequest("User ID is required.");
            }

            var user = await _userManager.FindByIdAsync(model.User_Id);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            user.Calories = model.Calories;
            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded)
            {
                return Ok(new
                {
                    Id = user.Id,
                    Email = user.Email,
                    Calories = user.Calories,
                });
            }

            return BadRequest(result.Errors);
        }


        // Token generation method
        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(double.Parse(_configuration["Jwt:ExpiryMinutes"])),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}

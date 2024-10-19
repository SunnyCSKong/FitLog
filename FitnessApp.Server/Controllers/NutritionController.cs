using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FitnessApp.Server.Models;
using System.Security.Claims;

namespace FitnessApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NutritionController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public NutritionController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/nutrition
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Nutrition>>> GetNutrition()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return await _context.Nutrition
                .Where(n => n.User_Id == userId) // Filter nutrition by user
                .ToListAsync();
        }

        // GET: api/nutrition/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Nutrition>> GetNutrition(string id)
        {
            var nutrition = await _context.Nutrition.FindAsync(id);

            // Check if the nutrition entry exists
            if (nutrition == null)
            {
                return NotFound();
            }

            return nutrition;
        }

        // GET: api/nutrition/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Nutrition>>> GetNutritionByUserId(string userId)
        {
            var nutritionItems = await _context.Nutrition
                                               .Where(n => n.User_Id == userId)
                                               .ToListAsync();

            if (nutritionItems == null || nutritionItems.Count == 0)
            {
                return Ok(new List<Nutrition>());  // Return an empty list if no items found
            }

            return Ok(nutritionItems);
        }

        // POST: api/nutrition
        [HttpPost]
        public async Task<ActionResult<Nutrition>> PostNutrition(Nutrition nutrition)
        {
            // Validate the User_Id is provided in the request
            if (string.IsNullOrEmpty(nutrition.User_Id))
            {
                return BadRequest("User_Id must be provided.");
            }

            // Validate if the user exists in the database
            var user = await _context.Users.FindAsync(nutrition.User_Id);
            if (user == null)
            {
                return BadRequest("User not found.");
            }

            // Associate the nutrition entry with the user
            _context.Nutrition.Add(nutrition);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetNutrition), new { id = nutrition.Id }, nutrition);
        }


        // PUT: api/nutrition/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNutrition(string id, Nutrition nutrition)
        {
            if (id != nutrition.Id)
            {
                return BadRequest();
            }

            var existingNutrition = await _context.Nutrition.FindAsync(id);

            // Check if the nutrition entry exists and belongs to the user
            if (existingNutrition == null)
            {
                return NotFound();
            }

            existingNutrition.Name = nutrition.Name;
            existingNutrition.Calories = nutrition.Calories;
            existingNutrition.Weight = nutrition.Weight;
            existingNutrition.Amount = nutrition.Amount;
            existingNutrition.Date = nutrition.Date;
            existingNutrition.Notes = nutrition.Notes;

            _context.Entry(existingNutrition).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NutritionExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/nutrition/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNutrition(string id)
        {
            var nutrition = await _context.Nutrition.FindAsync(id);

            if (nutrition == null)
            {
                return NotFound();
            }

            _context.Nutrition.Remove(nutrition);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool NutritionExists(string id)
        {
            return _context.Nutrition.Any(e => e.Id == id);
        }
    }
}

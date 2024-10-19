using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FitnessApp.Server.Models;
using System.Security.Claims;

namespace FitnessApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GoalController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public GoalController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/goal
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Goals>>> GetGoals()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return await _context.Goals
                .Where(g => g.User_Id == userId) // Filter goals by user
                .ToListAsync();
        }

        // GET: api/goal/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Goals>> GetGoal(string id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var goal = await _context.Goals.FindAsync(id);

            // Check if the goal exists and belongs to the user
            if (goal == null || goal.User_Id != userId)
            {
                return NotFound();
            }

            return goal;
        }
        // GET: api/goal/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Goals>>> GetGoalByUserId(string userId)
        {
            var goalItems = await _context.Goals
                                               .Where(n => n.User_Id == userId)
                                               .ToListAsync();

            if (goalItems == null || goalItems.Count == 0)
            {
                return Ok(new List<Goals>());  // Return an empty list if no items found
            }

            return Ok(goalItems);
        }

        // POST: api/goal
        [HttpPost]
        public async Task<ActionResult<Goals>> PostGoal(Goals goal)
        {
            // Validate the User_Id is provided in the request
            if (string.IsNullOrEmpty(goal.User_Id))
            {
                return BadRequest("User_Id must be provided.");
            }

            // Validate if the user exists in the database
            var user = await _context.Users.FindAsync(goal.User_Id);
            if (user == null)
            {
                return BadRequest("User not found.");
            }

            // Associate the goal with the user
            _context.Goals.Add(goal);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetGoal), new { id = goal.Id }, goal);
        }

        // PUT: api/goal/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGoal(string id, Goals goal,string User_Id)
        {
            if (id != goal.Id)
            {
                return BadRequest();
            }

            var existingGoal = await _context.Goals.FindAsync(id);

            // Check if the goal exists and belongs to the user
            if (existingGoal == null)
            {
                return NotFound();
            }

            existingGoal.Name = goal.Name;
            existingGoal.Description = goal.Description;
            existingGoal.Status = goal.Status;
            existingGoal.Deadline = goal.Deadline;

            _context.Entry(existingGoal).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GoalExists(id))
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

        // DELETE: api/goal/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGoal(string id) // Ensure the type matches
        {
            var goal = await _context.Goals.FindAsync(id);

            if (goal == null)
            {
                return NotFound();
            }

            _context.Goals.Remove(goal);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool GoalExists(string id)
        {
            return _context.Goals.Any(e => e.Id == id);
        }
    }
}

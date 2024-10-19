using Microsoft.AspNetCore.Mvc;
using FitnessApp.Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace FitnessApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorkoutController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public WorkoutController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/workout
        [HttpPost]
        public async Task<ActionResult<BaseWorkout>> CreateWorkout([FromBody] BaseWorkout workout)
        {
            if (workout == null)
            {
                return BadRequest("Workout is null.");
            }

            if (workout is WeightliftingWorkout weightliftingWorkout)
            {
                // Handle adding weightlifting exercises
                foreach (var exercise in weightliftingWorkout.Exercises)
                {
                    _context.Entry(exercise).State = EntityState.Added;
                }
            }

            _context.Workouts.Add(workout);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetWorkout), new { id = workout.Id }, workout);
        }

        // GET: api/workout/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<BaseWorkout>> GetWorkout(string id)
        {
            var workout = await _context.Workouts
                                        .Include(w => (w as WeightliftingWorkout).Exercises)
                                        .FirstOrDefaultAsync(w => w.Id == id);

            if (workout == null)
            {
                return NotFound();
            }

            return Ok(workout);
        }

        // GET: api/workout/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<BaseWorkout>>> GetWorkoutsByUserId(string userId)
        {
            var workouts = await _context.Workouts
                .Where(w => w.User_Id == userId)
                .Include(w => (w as WeightliftingWorkout).Exercises) // Include exercises if it's a WeightliftingWorkout
                .ToListAsync();

            if (workouts == null || !workouts.Any())
            {
                return NotFound("No workouts found for the specified user.");
            }

            return Ok(workouts);
        }

        // PUT: api/workout/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateWorkout(string id, [FromBody] BaseWorkout workout)
        {
            if (id != workout.Id)
            {
                return BadRequest("Workout ID mismatch.");
            }

            if (workout is WeightliftingWorkout weightliftingWorkout)
            {
                // Handle updates to exercises in a weightlifting workout
                foreach (var exercise in weightliftingWorkout.Exercises)
                {
                    if (exercise.Id.IsNullOrEmpty())
                    {
                        _context.Entry(exercise).State = EntityState.Added;
                    }
                    else
                    {
                        _context.Entry(exercise).State = EntityState.Modified;
                    }
                }
            }

            _context.Entry(workout).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!WorkoutExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // DELETE: api/workout/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWorkout(string id)
        {

            int rowsAffected = await _context.Database.ExecuteSqlRawAsync("DELETE FROM Exercise WHERE WeightliftingWorkoutId = {0}", id);

            var workout = await _context.Workouts
                                        .Include(w => (w as WeightliftingWorkout).Exercises)
                                        .FirstOrDefaultAsync(w => w.Id == id);
            if (workout == null)
            {
                return NotFound();
            }

            _context.Workouts.Remove(workout);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Check if a workout exists
        private bool WorkoutExists(string id)
        {
            return _context.Workouts.Any(e => e.Id == id);
        }
    }
}

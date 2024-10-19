using Microsoft.AspNetCore.Identity;

namespace FitnessApp.Server.Models
{
    public class User : IdentityUser
    {
        public int Calories { get; set; }

        public ICollection<Goals> Goals { get; set; } = new List<Goals>();

        public ICollection<BaseWorkout> Workouts { get; set; } = new List<BaseWorkout>();

        public ICollection<Nutrition> Nutrition { get; set; } = new List<Nutrition>();
    }
}

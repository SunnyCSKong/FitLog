namespace FitnessApp.Server.Models
{
    public class Register
    {
        public string Email { get; set; } = null!;

        public string Password { get; set; } = null!;

        public string ConfirmPassword { get; set; } = null!;

        public int? calorieIntake { get; set; }
    }
}
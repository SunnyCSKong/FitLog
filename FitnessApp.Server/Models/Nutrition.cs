using System.ComponentModel.DataAnnotations;

namespace FitnessApp.Server.Models
{
    public class Nutrition
    {
        [Required]
        public string Id { get; set; } = Guid.NewGuid().ToString(); 

        public string User_Id { get; set; }


        [Required]
        [StringLength(100)]
        public string Name { get; set; } = null!;

        public int Calories { get; set; }

        public double? Weight { get; set; }

        public int? Amount { get; set; }

        [Required]
        public DateTime Date { get; set; } = DateTime.Now;

        public string? Notes { get; set; } = null!;


    }
}


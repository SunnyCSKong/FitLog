using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace FitnessApp.Server.Models
{
    public enum WorkoutType
    {
        Weightlifting,
        Sports,
        Cardio
    }

    [JsonConverter(typeof(WorkoutConverter))] // Use custom converter
    public abstract class BaseWorkout
    {
        [Required]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        public string User_Id { get; set; }

        [Required]
        public DateTime Date { get; set; } = DateTime.Now;

        public int? Duration { get; set; }

        public int? CaloriesBurned { get; set; }

        public string? Notes { get; set; }
    }

    public class WeightliftingWorkout : BaseWorkout
    {
        public WeightliftingWorkout()
        {
            Type = WorkoutType.Weightlifting;
        }

        public WorkoutType Type { get; private set; } // Use private set to prevent modification

        public List<Exercise> Exercises { get; set; } = new List<Exercise>();

        public class Exercise
        {
            [Key]
            public string Id { get; set; } = Guid.NewGuid().ToString();
            public string Name { get; set; } = null!;
            public int Reps { get; set; }
            public int Sets { get; set; }
            public int Weight { get; set; }
        }
    }

    public class SportsWorkout : BaseWorkout
    {
        public SportsWorkout()
        {
            Type = WorkoutType.Sports;
        }

        public WorkoutType Type { get; private set; } // Use private set to prevent modification
        public string SportType { get; set; } = null!;
    }

    public class CardioWorkout : BaseWorkout
    {
        public CardioWorkout()
        {
            Type = WorkoutType.Cardio;
        }

        public WorkoutType Type { get; private set; } // Use private set to prevent modification
        public string Distance { get; set; } = null!;
    }

    public class WorkoutConverter : JsonConverter<BaseWorkout>
    {
        public override BaseWorkout Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            using (JsonDocument doc = JsonDocument.ParseValue(ref reader))
            {
                JsonElement root = doc.RootElement;

                // Determine the workout type from the incoming JSON
                if (root.TryGetProperty("Type", out JsonElement typeElement))
                {
                    WorkoutType type = (WorkoutType)Enum.Parse(typeof(WorkoutType), typeElement.GetString());

                    return type switch
                    {
                        WorkoutType.Weightlifting => JsonSerializer.Deserialize<WeightliftingWorkout>(root.GetRawText(), options),
                        WorkoutType.Sports => JsonSerializer.Deserialize<SportsWorkout>(root.GetRawText(), options),
                        WorkoutType.Cardio => JsonSerializer.Deserialize<CardioWorkout>(root.GetRawText(), options),
                        _ => throw new NotSupportedException($"Workout type {type} is not supported")
                    };
                }
            }
            throw new JsonException("Invalid JSON for BaseWorkout");
        }

        public override void Write(Utf8JsonWriter writer, BaseWorkout value, JsonSerializerOptions options)
        {
            JsonSerializer.Serialize(writer, value, value.GetType(), options);
        }
    }
}

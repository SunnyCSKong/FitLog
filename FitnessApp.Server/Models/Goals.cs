
namespace FitnessApp.Server.Models
{
    public enum Status
    {
        Incomplete,
        InProgress,
        Complete

    }
    public class Goals
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Name { get; set; }
        public string Description { get; set; }
        public Status Status { get; set; }
        public DateTime Deadline { get; set; } = DateTime.Now;
        public string User_Id { get; set; }  

    }
}

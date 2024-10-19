using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace FitnessApp.Server.Models
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Goals> Goals { get; set; }
        public DbSet<Nutrition> Nutrition { get; set; }
        public DbSet<BaseWorkout> Workouts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder); 

            modelBuilder.Entity<WeightliftingWorkout>();
            modelBuilder.Entity<SportsWorkout>();
            modelBuilder.Entity<CardioWorkout>();

            modelBuilder.Entity<BaseWorkout>()
                .HasDiscriminator<WorkoutType>("Type")
                .HasValue<WeightliftingWorkout>(WorkoutType.Weightlifting)
                .HasValue<SportsWorkout>(WorkoutType.Sports)
                .HasValue<CardioWorkout>(WorkoutType.Cardio);

            modelBuilder.Entity<Goals>()
                .HasOne<User>()
                .WithMany(u => u.Goals)
                .HasForeignKey(g => g.User_Id)
                .IsRequired();

            modelBuilder.Entity<Nutrition>()
                .HasOne<User>()
                .WithMany(u => u.Nutrition)
                .HasForeignKey(n => n.User_Id)
                .IsRequired();

            modelBuilder.Entity<BaseWorkout>()
                .HasOne<User>()
                .WithMany(u => u.Workouts)
                .HasForeignKey(w => w.User_Id)
                .IsRequired();
        }
    }
}

export enum WorkoutType {
  Weightlifting = "Weightlifting",
  Sports = "Sports",
  Cardio = "Cardio",
}
export interface IBaseWorkout {
  User_Id: string;
  Date: Date;
  Duration?: number | null;
  CaloriesBurned?: number;
  Notes?: string;
}
interface IWeightliftingWorkout extends IBaseWorkout {
  Type: WorkoutType.Weightlifting;
  Exercises: { Name: string; Reps: number; Sets: number; Weight: number }[]; // Specific to weightlifting
}
interface ISportsWorkout extends IBaseWorkout {
  Type: WorkoutType.Sports;
  SportType: string; // Specific to sports (e.g., basketball, soccer)
}

interface ICardioWorkout extends IBaseWorkout {
  Type: WorkoutType.Cardio;
  Distance: string; // Distance in km or miles
}

export type IWorkoutTable =
  | IWeightliftingWorkout
  | ISportsWorkout
  | ICardioWorkout;

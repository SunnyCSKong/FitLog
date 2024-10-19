import { WORKOUTS, USER_WORKOUTS } from "../apiRoutes/urls";
import { IWorkoutTable } from "../types/interface/workoutInterfaces";

// Function to fetch workouts by user ID
export const fetchWorkoutsByUserId = async (
  userId: string
): Promise<IWorkoutTable[]> => {
  try {
    const response = await fetch(`${USER_WORKOUTS}/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch workouts");
    }

    const data: IWorkoutTable[] = await response.json();
    return data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Unknown error");
  }
};
export const getWorkout = async (workoutId: string): Promise<IWorkoutTable> => {
  try {
    const response = await fetch(`${WORKOUTS}/${workoutId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch workouts");
    }

    const data: IWorkoutTable = await response.json();
    return data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Unknown error");
  }
};
// Function to post a new workout
export const postWorkout = async (
  workout: IWorkoutTable
): Promise<IWorkoutTable> => {
  try {
    const response = await fetch(WORKOUTS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(workout),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to add workout");
    }

    const data: IWorkoutTable = await response.json();
    return data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Unknown error");
  }
};
export const deleteWorkout = async (workoutId: string): Promise<void> => {
  try {
    const response = await fetch(`${WORKOUTS}/${workoutId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData || "Failed to delete goal");
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Unknown error");
  }
};

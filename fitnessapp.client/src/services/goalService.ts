import { GOALS, USER_GOALS } from "../apiRoutes/urls";
import IGoalInterface from "../types/interface/goalInterface";

export const fetchGoalsByUserId = async (
  userId: string
): Promise<IGoalInterface[]> => {
  try {
    const response = await fetch(`${USER_GOALS}/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData || "Failed to fetch nutrition items");
    }

    const data: IGoalInterface[] = await response.json();
    return data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Unknown error");
  }
};

export const postGoal = async (
  goal: IGoalInterface
): Promise<IGoalInterface> => {
  try {
    const response = await fetch(GOALS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(goal),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData || "Failed to add nutrition item");
    }

    const data: IGoalInterface = await response.json();
    return data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Unknown error");
  }
};

export const getGoal = async (goalId: string): Promise<IGoalInterface> => {
  try {
    const response = await fetch(`${GOALS}/${goalId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData || "Failed to fetch nutrition items");
    }

    const data: IGoalInterface = await response.json();
    return data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Unknown error");
  }
};

export const updateGoal = async (id, goal) => {
  try {
    const response = await fetch(`${GOALS}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(goal),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

   return;
  } catch (error) {
    console.error("Error updating goal:", error);
  }
};

export const deleteGoal = async (goalId: string): Promise<void> => {
  try {
    const response = await fetch(`${GOALS}/${goalId}`, {
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

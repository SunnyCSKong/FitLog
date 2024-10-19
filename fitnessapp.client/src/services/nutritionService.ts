import { NUTRITION, USER_NUTRITION } from "../apiRoutes/urls";
import INutritionInterface from "../types/interface/nutritionInterface";

// Function to fetch nutrition by user ID
export const fetchNutritionByUserId = async (
  userId: string
): Promise<INutritionInterface[]> => {
  try {
    const response = await fetch(`${USER_NUTRITION}/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData || "Failed to fetch nutrition items");
    }

    const data: INutritionInterface[] = await response.json();
    return data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Unknown error");
  }
};

export const getNutrition = async (
  nutritionId: string
): Promise<INutritionInterface> => {
  try {
    const response = await fetch(`${NUTRITION}/${nutritionId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData || "Failed to fetch nutrition item");
    }

    const data: INutritionInterface = await response.json();
    return data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Unknown error");
  }
};

export const postNutrition = async (
  nutrition: INutritionInterface
): Promise<INutritionInterface> => {
  try {
    const response = await fetch(NUTRITION, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nutrition),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData || "Failed to add nutrition item");
    }

    const data: INutritionInterface = await response.json();
    return data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Unknown error");
  }
};
export const updateNutrition = async (id, nutrition) => {
  try {
    const response = await fetch(`${NUTRITION}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nutrition),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return;
  } catch (error) {
    console.error("Error updating goal:", error);
  }
};

export const deleteNutrition = async (nutritionId: string): Promise<void> => {
  try {
    const response = await fetch(`${NUTRITION}/${nutritionId}`, {
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

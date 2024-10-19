import { User } from "../types/User";
import {
  USER_LOGIN,
  USER_REGISTER,
  USER_UPDATE_CALORIES,
} from "../apiRoutes/urls";
import ILoginInterface from "../types/interface/loginInterface";
import IRegisterInterface from "../types/interface/registerInterface";
import IUpdateCaloriesInterface from "../types/interface/updateCaloriesInterface";

export const updateCalories = async (
  calorieDetails: IUpdateCaloriesInterface
): Promise<User> => {
  try {
    const response = await fetch(USER_UPDATE_CALORIES, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(calorieDetails),
    });

    // Log the response for debugging
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.Message || "Failed to update calories");
    }

    localStorage.setItem("user", JSON.stringify(responseData));
    return responseData;
  } catch (error) {
    console.error("API call failed:", error);
    throw new Error(error instanceof Error ? error.message : "Unknown error");
  }
};

export const registerUser = async (
  userDetails: IRegisterInterface
): Promise<User> => {
  console.log(userDetails);

  try {
    const registrationResponse = await fetch(USER_REGISTER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    });

    if (!registrationResponse.ok) {
      const errorData = await registrationResponse.json();
      throw new Error(errorData.Message || "Registration failed");
    }

    const loginDetails: ILoginInterface = {
      email: userDetails.email,
      password: userDetails.password,
    };

    const user = await fetchUser(loginDetails);
    return user;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Unknown error");
  }
};

export const fetchUser = async (userLogin: ILoginInterface): Promise<User> => {
  try {
    const response = await fetch(USER_LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userLogin),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData || "Login failed");
    }
    const data = await response.json();
    const user: User = {
      id: data.id,
      email: data.email,
      token: data.Token,
      calories: data.calories,
    };
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Unknown error");
  }
};

export const getUserFromLocalStorage = (): User | null => {
  const userString = localStorage.getItem("user");
  if (userString) {
    return JSON.parse(userString) as User;
  }
  return null;
};

export const logout = (): void => {
  localStorage.removeItem("user");
  window.location.href = "/";
};

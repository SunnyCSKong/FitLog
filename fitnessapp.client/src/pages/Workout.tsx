import { useEffect, useState } from "react";
import DisplayTable from "./partials/DisplayTable";
import Title from "./partials/Title";
import "./Workout.css";
import { User } from "../types/User";
import { getUserFromLocalStorage } from "../services/userService";
import { IWorkoutTable } from "../types/interface/workoutInterfaces";
import { fetchWorkoutsByUserId } from "../services/workoutService";
import { Link } from "react-router-dom";
function Workout() {
  const [user, setUser] = useState<User | null>(null);
  const [workoutItems, setWorkoutItems] = useState<IWorkoutTable[]>([]);
  const [noWorkouts, setNoWorkouts] = useState(true);
  useEffect(() => {
    const storedUser = getUserFromLocalStorage();
    setUser(storedUser);
  }, []);
  useEffect(() => {
    const fetchWorkout = async () => {
      if (user) {
        try {
          const data = await fetchWorkoutsByUserId(user.id);
          setWorkoutItems(data);
          setNoWorkouts(data.length === 0);
        } catch (error) {
          console.log("no workouts:", error);
        }
      }
    };
    fetchWorkout();
  }, [user]);
  return (
    <div className="workout-container">
      <Title title="Workouts" />
      {user ? (
        !noWorkouts ? (
          <DisplayTable data={workoutItems} type="workouts" />
        ) : (
          <div>Get some workouts in buddy, you got none.</div>
        )
      ) : (
        <div>
          Not signed in D: Please <Link to="/login">sign in.</Link>
        </div>
      )}
    </div>
  );
}

export default Workout;

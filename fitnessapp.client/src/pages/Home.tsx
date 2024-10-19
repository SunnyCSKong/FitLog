import "./Home.css";
import MiniTable from "./partials/MiniTable";
import {
  IBaseWorkout,
  IWorkoutTable,
} from "../types/interface/workoutInterfaces";
import IGoalInterface, { Status } from "../types/interface/goalInterface";
import Title from "./partials/Title";
import { useEffect, useState } from "react";
import { User } from "../types/User";
import SwapCallsIcon from "@mui/icons-material/SwapCalls";
import WorkoutsBarChart, { GaugeChart } from "./partials/Charts";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {
  getUserFromLocalStorage,
  updateCalories,
} from "../services/userService";
import INutritionInterface from "../types/interface/nutritionInterface";
import { fetchWorkoutsByUserId } from "../services/workoutService";
import { fetchNutritionByUserId } from "../services/nutritionService";
import { fetchGoalsByUserId } from "../services/goalService";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { Fab } from "@mui/material";

function Home({ isLoggedIn }) {
  const [user, setUser] = useState<User | null>(null);
  const [caloriesEaten, setCaloriesEaten] = useState(0);
  const [newCalories, setNewCalories] = useState(user?.calories || 2000);
  const [showCaloricInput, setShowCaloricInput] = useState(false);
  const [workoutItems, setWorkoutItems] = useState([]);
  const [nutritionItems, setNutritionItems] = useState([]);
  const [goalItems, setGoalItems] = useState([]);
  const currentDate = new Date();

  const toggleCaloricInput = () => {
    setShowCaloricInput((prev) => !prev);
  };

  useEffect(() => {
    if (isLoggedIn) {
      const storedUser = getUserFromLocalStorage();
      setUser(storedUser);
    }
  }, []);
  useEffect(() => {
    const fetchWorkout = async () => {
      if (user) {
        try {
          const data = await fetchWorkoutsByUserId(user.id);
          setWorkoutItems(data);
        } catch {
          console.log("workout get fail");
        }
      }
    };
    const fetchNutrition = async () => {
      if (user) {
        try {
          const data = await fetchNutritionByUserId(user.id);
          setNutritionItems(data);
        } catch {
          console.log("nutrition get fail");
        }
      }
    };
    const fetchGoals = async () => {
      if (user) {
        try {
          const data = await fetchGoalsByUserId(user.id);
          setGoalItems(data);
        } catch {
          console.log("goal get fail");
        }
      }
    };
    fetchGoals();
    fetchNutrition();
    fetchWorkout();
  }, [user]);
  const applyCalories = async () => {
    try {
      const updatedUser = await updateCalories({
        User_Id: user.id,
        calories: newCalories,
      });
      setUser(updatedUser);
      setShowCaloricInput(false);
    } catch (error) {
      console.error("Error updating calories:", error);
    }
  };
  function sumCaloriesLastDay(): number {
    const oneDayAgo = new Date(currentDate);
    oneDayAgo.setDate(currentDate.getDate() - 1);
    return nutritionItems.reduce((total, item) => {
      const itemDate = new Date(item.date);
      return itemDate >= oneDayAgo && itemDate <= currentDate
        ? total + item.calories
        : total;
    }, 0);
  }
  function workoutsLastMonth(): number {
    const lastMonth = new Date(currentDate);
    lastMonth.setDate(currentDate.getDate() - 30);

    return workoutItems.filter((workout) => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= lastMonth && workoutDate <= currentDate;
    }).length;
  }

  function goalsLeft(data: IGoalInterface[]): number {
    return data.filter((goal) => goal.status !== Status.Complete).length;
  }
  const gaugeSize = Math.min(
    window.innerWidth * 0.28,
    window.innerHeight * 0.28
  );
  const [showGauge, setShowGauge] = useState(true);

  const toggleChart = () => {
    setShowGauge((prevShowGauge) => !prevShowGauge);
  };
  return (
    <div className="home-container">
      {!isLoggedIn && (
        <div>
          Not signed in D: Please <Link to="/login">sign in.</Link>
        </div>
      )}
      {isLoggedIn && (
        <>
          <div className="chart home-area">
            {showGauge ? (
              <>
                <Title title="Calories Eaten" />
                <GaugeChart
                  caloriesEaten={sumCaloriesLastDay()}
                  userCalories={user?.calories}
                  gaugeSize={gaugeSize}
                />
                <button
                  onClick={toggleCaloricInput}
                  className="ellipsis-button"
                >
                  <MoreHorizIcon />
                </button>
                {showCaloricInput && (
                  <div className="caloric-input-overlay">
                    <div className="caloric-input">
                      <input
                        type="number"
                        value={newCalories}
                        onChange={(e) => setNewCalories(Number(e.target.value))}
                        min="1"
                      />
                      <button onClick={applyCalories} className="apply-button">
                        Apply
                      </button>
                      <button onClick={() => setShowCaloricInput(false)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <Title title="Workouts Per Week" />
                <WorkoutsBarChart
                  size={gaugeSize}
                  className="chart-item"
                  workouts={workoutItems}
                />
              </>
            )}
            <button onClick={toggleChart} className="toggle-button">
              <SwapCallsIcon />
            </button>
          </div>
          <div className="workouts home-area">
            <Title title="Workouts" />
            <div className="woTable">
              <MiniTable data={workoutItems} type="workouts" />
            </div>
            <div className="stat">
              <h2>{workoutsLastMonth(workoutItems)}</h2>
              workouts in 30 days
            </div>
          </div>
          <div className="goals home-area">
            <Title title="Goals" />
            <MiniTable
              data={goalItems.filter((goal) => goal.status !== Status.Complete)}
              type="goals"
            />
            <h2>{goalsLeft(goalItems)}</h2>
            incomplete goals
          </div>
          <div className="nutrition home-area">
            <Title title="Nutrition" />
            <MiniTable data={nutritionItems} type="nutrition" />
            <h2>{sumCaloriesLastDay(nutritionItems)}</h2>
            calories eaten today
          </div>
        </>
      )}
      <div className="buttonLabel">
        <Link to="/add">
          <Fab color="primary" aria-label="add">
            <AddIcon />
          </Fab>
        </Link>
      </div>
    </div>
  );
}

export default Home;

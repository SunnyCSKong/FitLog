import "./Goals.css";
import DisplayTable from "./partials/DisplayTable.tsx";
import Title from "./partials/Title.tsx";
import { useEffect, useState } from "react";
import { User } from "../types/User.ts";
import IGoalInterface from "../types/interface/goalInterface.ts";
import { getUserFromLocalStorage } from "../services/userService.ts";
import { fetchGoalsByUserId } from "../services/goalService.ts";
import { Link } from "react-router-dom";

function Goals() {
  const [user, setUser] = useState<User | null>(null);
  const [goalItems, setGoalItems] = useState<IGoalInterface[]>([]);
  const [noGoals, setNoGoals] = useState(true);
  useEffect(() => {
    const storedUser = getUserFromLocalStorage();
    setUser(storedUser);
  }, []);

  useEffect(() => {
    const fetchGoals = async () => {
      if (user) {
        try {
          const data = await fetchGoalsByUserId(user.id);
          setGoalItems(data);
          setNoGoals(data.length === 0);
        } catch {
          console.log("failed");
        }
      }
    };
    fetchGoals();
  }, [user]);
  return (
    <div className="goals-container">
      <Title title="Goals" />
      {user ? (
        !noGoals ? (
          <DisplayTable data={goalItems} type="goals" />
        ) : (
          <div>Get some goals in buddy you got none.</div>
        )
      ) : (
        <div>
          Not signed in D: Please <Link to="/login">sign in.</Link>
        </div>
      )}
    </div>
  );
}

export default Goals;

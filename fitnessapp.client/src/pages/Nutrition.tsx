import { useEffect, useState } from "react";
import "./Nutrition.css";
import DisplayTable from "./partials/DisplayTable";
import Title from "./partials/Title";
import { User } from "../types/User";
import INutritionInterface from "../types/interface/nutritionInterface";
import { getUserFromLocalStorage } from "../services/userService";
import { fetchNutritionByUserId } from "../services/nutritionService";
import { Link } from "react-router-dom";
function Nutrition() {
  const [user, setUser] = useState<User | null>(null);
  const [nutritionItems, setNutritionItems] = useState<INutritionInterface[]>(
    []
  );
  const [noFood, setNoFood] = useState(true);
  useEffect(() => {
    const storedUser = getUserFromLocalStorage();
    setUser(storedUser);
  }, []);

  useEffect(() => {
    const fetchNutrition = async () => {
      if (user) {
        try {
          const data = await fetchNutritionByUserId(user.id);
          setNutritionItems(data);
          setNoFood(data.length === 0);
        } catch {
          console.log("failed");
        }
      }
    };
    fetchNutrition();
  }, [user]);
  return (
    <div className="nutrition-container">
      <Title title="Nutrition" />
      {user ? (
        !noFood ? (
          <DisplayTable data={nutritionItems} type="nutrition" />
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

export default Nutrition;

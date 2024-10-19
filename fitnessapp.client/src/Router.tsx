import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Workout from "./pages/Workout";
import Goals from "./pages/Goals";
import Nutrition from "./pages/Nutrition";
import NotFound from "./pages/partials/NotFound";
import Login from "./pages/Login";
import AddNew from "./pages/AddNew";
import Edit from "./pages/Edit";

function Router({ isLoggedIn, setIsLoggedIn }) {
  return (
    <Routes>
      <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
      <Route path="workouts" element={<Workout />} />
      <Route path="goals" element={<Goals />} />
      <Route path="nutrition" element={<Nutrition />} />
      <Route path="login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
      <Route path="*" element={<NotFound />} />
      <Route path="add" element={<AddNew isLoggedIn={isLoggedIn} />} />
      <Route
        path="/edit/:id/:type"
        element={<Edit isLoggedIn={isLoggedIn} />}
      />
    </Routes>
  );
}

export default Router;

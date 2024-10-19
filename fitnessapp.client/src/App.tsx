import { useState } from "react";
import "./App.css";
import Router from "./Router";
import Navbar from "./pages/partials/Navbar";
import { getUserFromLocalStorage } from "./services/userService";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!getUserFromLocalStorage());

  return (
    <div className="App">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <div className="mainContent">
        <Router isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      </div>
    </div>
  );
}

export default App;

import "./Navbar.css";
import HomeIcon from "@mui/icons-material/Home";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import FlagIcon from "@mui/icons-material/Flag";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";

interface NavbarProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
}

function Navbar({ isLoggedIn, setIsLoggedIn }: NavbarProps) {
  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };

  return (
    <div className="sideNav">
      <div className="logo">
        <h3>FitLog</h3>
      </div>
      <a href="/">
        <span className="icon">
          <HomeIcon />
        </span>{" "}
        Home
      </a>
      <a href="/workouts">
        <span className="icon">
          <FitnessCenterIcon />
        </span>{" "}
        Workouts
      </a>
      <a href="/goals">
        <span className="icon">
          <FlagIcon />
        </span>{" "}
        Goals
      </a>
      <a href="/nutrition">
        <span className="icon">
          <LocalDiningIcon />
        </span>{" "}
        Nutrition
      </a>
      {isLoggedIn ? (
        <a className="log" onClick={handleLogout}>
          <span className="icon">
            <LogoutIcon />
          </span>{" "}
          Logout
        </a>
      ) : (
        <a className="log" href="/login">
          <span className="icon">
            <LoginIcon />
          </span>{" "}
          Login
        </a>
      )}
    </div>
  );
}

export default Navbar;

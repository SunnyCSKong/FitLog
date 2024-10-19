import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { Button, Snackbar } from "@mui/material";
import { useState } from "react";
import ILoginInterface from "../types/interface/loginInterface";
import { fetchUser, registerUser } from "../services/userService";
import { useNavigate } from "react-router-dom";
import IRegisterInterface from "../types/interface/registerInterface";

function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [calorieIntake, setCalorieIntake] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [register, setRegister] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const loginDetails: ILoginInterface = {
      email,
      password,
    };
    try {
      const user = await fetchUser(loginDetails);
      setIsLoggedIn(true); // Update the login state
      navigate("/"); // Redirect to home
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
      setOpenSnackbar(true);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const registerDetails: IRegisterInterface = {
      email,
      password,
      confirmPassword,
      calorieIntake,
    };
    console.log(registerDetails);

    try {
      const user = await registerUser(registerDetails);
      setIsLoggedIn(true); // Update the login state
      navigate("/");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
      setOpenSnackbar(true);
    }
  };
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };
  return (
    <div>
      <Box sx={{ mt: 8 }}>
        <form onSubmit={register ? handleRegister : handleLogin}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{
              marginTop: "20vh",
              width: "40vw",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "white",
                },
                "& input": {
                  color: "white",
                },
              },
              "& .MuiInputLabel-root": {
                color: "white",
              },
            }}
          />
          <br />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{
              width: "40vw",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "white",
                },
                "& input": {
                  color: "white",
                },
              },
              "& .MuiInputLabel-root": {
                color: "white",
              },
            }}
          />
          <br />
          {register && (
            <>
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                variant="outlined"
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                sx={{
                  width: "40vw",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white",
                    },
                    "& input": {
                      color: "white",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "white",
                  },
                }}
              />
              <br />
              <TextField
                fullWidth
                label="Calorie Intake"
                type="number"
                variant="outlined"
                margin="normal"
                value={calorieIntake}
                onChange={(e) =>
                  setCalorieIntake(e.target.value as unknown as number)
                }
                sx={{
                  width: "40vw",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white",
                    },
                    "& input": {
                      color: "white",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "white",
                  },
                }}
              />
            </>
          )}
          <br />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, width: "40vw" }}
          >
            {register ? "Register" : "Log In"}
          </Button>
        </form>
        <Button
          variant="text"
          onClick={() => setRegister(!register)}
          sx={{ mt: 2 }}
        >
          {register ? "Already have an account? Log in." : "Register"}
        </Button>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message={error}
        />
      </Box>
    </div>
  );
}

export default Login;

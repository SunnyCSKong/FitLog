import "./AddNew.css";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Status } from "../types/interface/goalInterface";
import { getUserFromLocalStorage } from "../services/userService";
import { User } from "../types/User";
import { postWorkout } from "../services/workoutService";
import { useNavigate } from "react-router-dom";
import { postGoal } from "../services/goalService";
import { postNutrition } from "../services/nutritionService";

function AddNew({ isLoggedIn }) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const [type, setType] = useState("Workout");
  // For Goals
  const [goalName, setGoalName] = useState("");
  const [goalDescription, setGoalDescription] = useState("");
  const [goalDate, setGoalDate] = useState(null);

  // For Nutrition
  const [nutritionName, setNutritionName] = useState("");
  const [nutritionCalories, setNutritionCalories] = useState("");
  const [nutritionWeight, setNutritionWeight] = useState("");
  const [nutritionAmount, setNutritionAmount] = useState("");
  const [nutritionNotes, setNutritionNotes] = useState("");

  // For Workouts
  const [workoutDuration, setWorkoutDuration] = useState(0);
  const [workoutNotes, setWorkoutNotes] = useState("");
  const [workoutType, setWorkoutType] = useState("");
  const [exercises, setExercises] = useState([]);
  const [newExercise, setNewExercise] = useState({
    Name: "",
    Reps: 0,
    Sets: 0,
    Weight: 0,
  });
  const [sport, setSport] = useState("");
  const [distance, setDistance] = useState("");

  const [hasExercises, setHasExercises] = useState(false);

  useEffect(() => {
    const storedUser = getUserFromLocalStorage();
    setUser(storedUser);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let data = {};
    data.User_Id = user.id;
    if (type === "Goal") {
      data = {
        ...data,
        Name: goalName,
        Description: goalDescription,
        Status: Status.Incomplete,
        Deadline: goalDate,
      };

      try {
        const response = await postGoal(data);
        navigate("/");
      } catch (error) {
        alert("Error posting workout");
      }
    } else if (type === "Nutrition") {
      data = {
        ...data,
        Name: nutritionName,
        Calories: Number(nutritionCalories),
        Weight: Number(nutritionWeight),
        Amount: Number(nutritionAmount),
        Notes: nutritionNotes,
      };
      try {
        console.log(data);

        const response = await postNutrition(data);
        navigate("/");
      } catch (error) {
        alert("Error posting workout");
      }
    } else if (type === "Workout") {
      if (!hasExercises && workoutType === "Weightlifting") {
        alert("Please add at least one exercise before submitting.");
        return;
      }
      const convertedExercises = exercises.map((exercise) => ({
        Name: exercise.Name,
        Reps: Number(exercise.Reps), // Convert to number
        Sets: Number(exercise.Sets), // Convert to number
        Weight: Number(exercise.Weight), // Convert to number
      }));

      data = {
        ...data,
        Duration: Number(workoutDuration),
        Notes: workoutNotes,
        Type: workoutType,
      };
      if (workoutType === "Weightlifting") {
        data = {
          ...data,
          Exercises: convertedExercises,
        };
      } else if (workoutType === "Sports") {
        data = { ...data, SportType: sport };
      } else if (workoutType === "Cardio") {
        data = { ...data, Distance: String(distance) };
      }
      try {
        const response = await postWorkout(data);
        navigate("/");
      } catch (error) {
        alert("Error posting workout");
      }
    }
  };
  const handleChange = (event) => {
    setWorkoutType(event.target.value);
  };

  const handleExerciseChange = (event) => {
    const { name, value } = event.target;
    setNewExercise((prev) => ({ ...prev, [name]: value }));
  };

  const addExercise = () => {
    // Check if the exercise fields are filled
    if (
      !newExercise.Name ||
      newExercise.Reps <= 0 ||
      newExercise.Sets <= 0 ||
      newExercise.Weight <= 0
    ) {
      alert("Please fill in all exercise fields before adding.");
      return;
    }

    setExercises((prev) => [...prev, newExercise]);
    setNewExercise({ Name: "", Reps: 0, Sets: 0, Weight: 0 });
    setHasExercises(true);
  };

  const deleteExercise = (index) => {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <div className="type-dropdown">
            <FormControl
              fullWidth
              variant="outlined"
              sx={{
                marginBottom: "16px",
                width: "150px", // Set a fixed width
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
            >
              <InputLabel>Type</InputLabel>
              <Select
                value={type}
                onChange={(event) => setType(event.target.value)}
                label="Type"
                sx={{
                  "& .MuiSelect-select": {
                    color: "white",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white",
                  },
                }}
              >
                <MenuItem value="Goal">Goal</MenuItem>
                <MenuItem value="Nutrition">Nutrition</MenuItem>
                <MenuItem value="Workout">Workout</MenuItem>
              </Select>
            </FormControl>
          </div>
          <form action="" onSubmit={handleSubmit}>
            {type === "Goal" && (
              <>
                <h3 style={{ marginBottom: 0 }}>What is your new goal?</h3>
                <TextField
                  fullWidth
                  label="Name"
                  type="text"
                  variant="outlined"
                  margin="normal"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
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
                  label="Description"
                  type="text"
                  variant="outlined"
                  margin="normal"
                  value={goalDescription}
                  onChange={(e) => setGoalDescription(e.target.value)}
                  required
                  sx={{
                    marginTop: "16px",
                    marginBottom: "16px",
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
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Accomplish By"
                    value={goalDate}
                    onChange={(date) => setGoalDate(date)}
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
                </LocalizationProvider>
                <br />
              </>
            )}

            {type === "Nutrition" && (
              <>
                <h3 style={{ marginBottom: 0 }}>What did you eat?</h3>
                <TextField
                  fullWidth
                  label="Name"
                  type="text"
                  variant="outlined"
                  margin="normal"
                  value={nutritionName}
                  onChange={(e) => setNutritionName(e.target.value)}
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
                  label="Calories"
                  type="number"
                  variant="outlined"
                  margin="normal"
                  value={nutritionCalories}
                  onChange={(e) => setNutritionCalories(e.target.value)}
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
                  label="Weight (g)"
                  type="number"
                  variant="outlined"
                  margin="normal"
                  value={nutritionWeight}
                  onChange={(e) => setNutritionWeight(e.target.value)}
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
                  label="Amount"
                  type="number"
                  variant="outlined"
                  margin="normal"
                  value={nutritionAmount}
                  onChange={(e) => setNutritionAmount(e.target.value)}
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
                  label="Notes"
                  type="text"
                  variant="outlined"
                  margin="normal"
                  value={nutritionNotes}
                  onChange={(e) => setNutritionNotes(e.target.value)}
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
              </>
            )}
            {type === "Workout" && (
              <>
                <h3 style={{ marginBottom: 0 }}>What was your workout?</h3>
                <TextField
                  fullWidth
                  label="Duration (minutes)"
                  type="number"
                  variant="outlined"
                  margin="normal"
                  inputProps={{ min: 0 }}
                  value={workoutDuration}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value < 0) {
                      setWorkoutDuration(0);
                    } else if (value === 0) {
                      setWorkoutDuration(0);
                    } else {
                      setWorkoutDuration(value);
                    }
                  }}
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
                  label="Notes"
                  type="text"
                  variant="outlined"
                  margin="normal"
                  value={workoutNotes}
                  onChange={(e) => setWorkoutNotes(e.target.value)}
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

                <FormControl
                  fullWidth
                  variant="outlined"
                  required
                  sx={{
                    marginTop: "16px",
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
                >
                  <InputLabel>Workout Type</InputLabel>
                  <Select
                    value={workoutType}
                    onChange={handleChange}
                    label="Workout Type"
                    sx={{
                      "& .MuiSelect-select": {
                        color: "white",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white",
                      },
                    }}
                  >
                    <MenuItem value="Weightlifting">Weightlifting</MenuItem>
                    <MenuItem value="Sports">Sports</MenuItem>
                    <MenuItem value="Cardio">Cardio</MenuItem>
                  </Select>
                </FormControl>
                <br />
                {workoutType === "Weightlifting" && (
                  <>
                    <h4 style={{ marginBottom: "10px", marginTop: "10px" }}>
                      Add Exercises
                    </h4>
                    <TextField
                      label="Exercise *"
                      name="Name"
                      value={newExercise.Name}
                      onChange={handleExerciseChange}
                      sx={{
                        marginRight: "0.5em",
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
                    <TextField
                      label="Reps *"
                      name="Reps"
                      type="number"
                      value={newExercise.Reps}
                      onChange={handleExerciseChange}
                      sx={{
                        marginRight: "0.5em",
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
                    <TextField
                      label="Sets *"
                      name="Sets"
                      type="number"
                      value={newExercise.Sets}
                      onChange={handleExerciseChange}
                      sx={{
                        marginRight: "0.5em",
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
                    <TextField
                      label="Weight (lbs) *"
                      name="Weight"
                      type="number"
                      value={newExercise.Weight}
                      onChange={handleExerciseChange}
                      sx={{
                        marginRight: "0.5em",
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
                    <Button
                      variant="contained"
                      onClick={addExercise}
                      sx={{ margin: "10px" }}
                    >
                      Add Exercise
                    </Button>

                    <div>
                      {exercises.map((exercise, index) => (
                        <div key={index} className="exercise">
                          <p style={{ flexGrow: 1 }}>
                            {exercise.Name} - Reps: {exercise.Reps}, Sets:{" "}
                            {exercise.Sets}, Weight: {exercise.Weight} lbs
                          </p>
                          <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => deleteExercise(index)}
                          >
                            Delete
                          </Button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {workoutType === "Sports" && (
                  <>
                    <TextField
                      fullWidth
                      label="Sport"
                      type="text"
                      variant="outlined"
                      margin="normal"
                      value={sport} // Bind the value to the state
                      onChange={(e) => setSport(e.target.value)}
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
                  </>
                )}

                {workoutType === "Cardio" && (
                  <>
                    <TextField
                      fullWidth
                      label="Distance (km)"
                      type="number"
                      variant="outlined"
                      margin="normal"
                      inputProps={{ min: 0 }}
                      value={distance} // Bind the value to the state
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value < 0) {
                          setDistance(0); // Set distance to 0 if value is negative
                        } else if (value === 0) {
                          setDistance(0); // Clear the distance if value is 0
                        } else {
                          setDistance(value); // Update the distance state
                        }
                      }}
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
                  </>
                )}
              </>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, width: "40vw" }}
            >
              Add {type}
            </Button>
          </form>
        </div>
      ) : (
        <div style={{ marginTop: "20vh" }}>Not logged in buddy LOG IN :DDD</div>
      )}
    </div>
  );
}

export default AddNew;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getGoal, updateGoal } from "../services/goalService";
import { getNutrition, updateNutrition } from "../services/nutritionService";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Status } from "../types/interface/goalInterface";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

function Edit({ isLoggedIn }) {
  const { id, type } = useParams();
  const [data, setData] = useState({});
  //For goals
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [goalDate, setGoalDate] = useState(null);
  const [goalStatus, setGoalStatus] = useState<Status>(Status.Incomplete);

  //For nutrition
  const [nutritionName, setNutritionName] = useState("");
  const [nutritionCalories, setNutritionCalories] = useState(0);
  const [nutritionWeight, setNutritionWeight] = useState(0);
  const [nutritionAmount, setNutritionAmount] = useState(0);
  const [nutritionNotes, setNutritionNotes] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      if (type === "goals") {
        const item = await getGoal(id);
        setData(item);
        setName(item.name);
        setDescription(item.description);
        setGoalDate(item.deadline);
        setGoalStatus(item.status);
      } else if (type === "nutrition") {
        const item = await getNutrition(id);
        setData(item);
        setNutritionName(item.name);
        setNutritionAmount(item.amount);
        setNutritionCalories(item.calories);
        setNutritionWeight(item.weight);
        setNutritionNotes(item.notes);
      }
    };
    loadData();
  }, [id, type]);

  const handleChange = (event) => {
    setName(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (type === "goals") {
      const updatedData = {
        ...data,
        name: name,
        description: description,
        deadline: goalDate,
        status: goalStatus,
      };
      try {
        await updateGoal(id, updatedData);
        navigate("/goals");
      } catch (error) {
        console.error("Error updating goal:", error);
      }
    } else if (type === "nutrition") {
      const updatedData = {
        ...data,
        name: nutritionName,
        calories: nutritionCalories,
        weight: nutritionWeight,
        amount: nutritionAmount,
        notes: nutritionNotes,
      };
      try {
        await updateNutrition(id, updatedData);
        navigate("/nutrition");
      } catch (error) {
        console.error("Error updating goal:", error);
      }
    }
  };
  return (
    <>
      {isLoggedIn ? (
        <div className="" style={{ marginTop: "4em" }}>
          <h2>Edit</h2>
          <form action="" onSubmit={handleSubmit}>
            {type === "goals" ? (
              <>
                <TextField
                  fullWidth
                  label="Name"
                  type="text"
                  variant="outlined"
                  margin="normal"
                  value={name}
                  onChange={handleChange}
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
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
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
                    value={dayjs(goalDate)}
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
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={goalStatus}
                    onChange={(e) => {
                      setGoalStatus(e.target.value);
                    }}
                    label="Status"
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
                    <MenuItem value={Status.Incomplete}>Incomplete</MenuItem>
                    <MenuItem value={Status.InProgress}>In Progress</MenuItem>
                    <MenuItem value={Status.Complete}>Completed</MenuItem>
                  </Select>
                </FormControl>
              </>
            ) : (
              <>
                <TextField
                  fullWidth
                  label="Name"
                  type="text"
                  variant="outlined"
                  margin="normal"
                  value={nutritionName}
                  onChange={(e) => {
                    setNutritionName(e.target.value);
                  }}
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
              Finish Editing
            </Button>
          </form>
        </div>
      ) : (
        <div className="">Not logged in :(</div>
      )}
    </>
  );
}

export default Edit;

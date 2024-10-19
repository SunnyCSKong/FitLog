import { createTheme, ThemeProvider, Paper } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { GoalHeaders, NutritionHeaders, WorkoutHeaders } from "./Headers";

const darkTheme = createTheme({
  palette: {
    mode: "dark", // Enable dark mode
  },
});

interface MiniTableProps {
  data: any[];
  type: "goals" | "nutrition" | "workouts";
}

export default function MiniTable({ data, type }: MiniTableProps) {
  return (
    <div className="table-container">
      <ThemeProvider theme={darkTheme}>
        <TableContainer component={Paper}>
          <Table aria-label="mini table">
            {type === "goals" && <GoalHeaders caller="miniTable" />}
            {type === "nutrition" && <NutritionHeaders caller="miniTable" />}
            {type === "workouts" && <WorkoutHeaders caller="miniTable" />}
            <TableBody>
              {data.slice(0, 3).map((row) => (
                <TableRow key={row.id}>
                  {type === "goals" && (
                    <>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell align="center">{row.status}</TableCell>
                      <TableCell align="center">
                        {row.deadline.split("T")[0]}
                      </TableCell>
                    </>
                  )}
                  {type === "nutrition" && (
                    <>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="center">{row.calories}</TableCell>
                      <TableCell align="center">{row.weight}</TableCell>
                      <TableCell align="center">{row.amount}</TableCell>
                      <TableCell align="center">
                        {row.date.split("T")[0]}
                      </TableCell>
                    </>
                  )}
                  {type === "workouts" && (
                    <>
                      <TableCell>{row.type}</TableCell>
                      <TableCell align="center">{row.duration}</TableCell>
                      <TableCell component="th" scope="row" align="center">
                        {row.date.split("T")[0]}
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ThemeProvider>
    </div>
  );
}

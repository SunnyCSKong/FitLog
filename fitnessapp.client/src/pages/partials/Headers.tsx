import { TableCell, TableHead, TableRow } from "@mui/material";

export function GoalHeaders({ caller }) {
  return (
    <TableHead>
      <TableRow>
        <TableCell>Goal</TableCell>
        <TableCell>Description</TableCell>
        <TableCell align="center">Status</TableCell>
        <TableCell align="center">Accomplish by</TableCell>
        {caller !== "miniTable" && <TableCell />}
      </TableRow>
    </TableHead>
  );
}

export function NutritionHeaders({ caller }) {
  return (
    <TableHead>
      <TableRow>
        <TableCell>Food</TableCell>
        <TableCell align="center">Calories</TableCell>
        <TableCell align="center">Weight (g)</TableCell>
        <TableCell align="center">Quantity</TableCell>
        <TableCell align="center">Date</TableCell>
        {caller !== "miniTable" && <TableCell />}
      </TableRow>
    </TableHead>
  );
}

export function WorkoutHeaders({ caller }) {
  return (
    <TableHead>
      <TableRow>
        {caller === "display" && <TableCell></TableCell>}
        <TableCell>Type</TableCell>
        <TableCell align="center">Duration</TableCell>
        <TableCell align="center">Date</TableCell>
        {caller !== "miniTable" && <TableCell />}
      </TableRow>
    </TableHead>
  );
}

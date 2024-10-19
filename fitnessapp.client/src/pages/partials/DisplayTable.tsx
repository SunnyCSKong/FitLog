import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import LastPageIcon from "@mui/icons-material/LastPage";
import DeleteIcon from "@mui/icons-material/Delete";
import Collapse from "@mui/material/Collapse";
import { useState } from "react";
import { createTheme, ThemeProvider, Paper } from "@mui/material";
const darkTheme = createTheme({
  palette: {
    mode: "dark", // Enable dark mode
  },
});

import "./DisplayTable.css";
import WorkoutCollapsible from "./WorkoutCollapsible";
import { GoalHeaders, NutritionHeaders, WorkoutHeaders } from "./Headers";
import { deleteGoal } from "../../services/goalService";
import { deleteNutrition } from "../../services/nutritionService";
import { deleteWorkout } from "../../services/workoutService";

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

interface DisplayTableProps {
  data: any[];
  type: "goals" | "nutrition" | "workouts";
}

export default function DisplayTable({ data, type }: DisplayTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState<number | null>(null);

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (id: string) => {
    if (type === "goals") {
      try {
        await deleteGoal(id);
        console.log("Goal deleted successfully");
      } catch (error) {
        console.error("Error deleting goal:", error);
      }
    } else if (type === "nutrition") {
      try {
        await deleteNutrition(id);
        console.log("Goal deleted successfully");
      } catch (error) {
        console.error("Error deleting nutrition:", error);
      }
    } else {
      try {
        await deleteWorkout(id);
        console.log("Workout deleted successfully");
      } catch (error) {
        console.error("Error deleting workout:", error);
      }
    }
    window.location.reload();
  };

  return (
    <div className="table-container">
      <ThemeProvider theme={darkTheme}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
            {type === "goals" && <GoalHeaders caller="display" />}
            {type === "nutrition" && <NutritionHeaders caller="display" />}
            {type === "workouts" && <WorkoutHeaders caller="display" />}
            <TableBody>
              {(rowsPerPage > 0
                ? data.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : data
              ).map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow>
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
                        <TableCell align="center">
                          <IconButton onClick={() => handleDelete(row.id)}>
                            <DeleteIcon />
                          </IconButton>
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
                        <TableCell align="center">
                          <IconButton onClick={() => handleDelete(row.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </>
                    )}
                    {type === "workouts" && (
                      <>
                        <TableCell align="center">
                          <IconButton
                            onClick={() =>
                              setOpen(open === row.id ? null : row.id)
                            }
                          >
                            {open === row.id ? (
                              <KeyboardArrowUpIcon />
                            ) : (
                              <KeyboardArrowDownIcon />
                            )}
                          </IconButton>
                        </TableCell>
                        <TableCell>{row.type}</TableCell>
                        <TableCell align="center">{row.duration}</TableCell>
                        <TableCell component="th" scope="row" align="center">
                          {row.date.split("T")[0]}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton onClick={() => handleDelete(row.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                  <TableRow>
                    {type === "workouts" && (
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={5}
                      >
                        <Collapse
                          in={open === row.id}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box margin={1}>
                            <WorkoutCollapsible row={row}></WorkoutCollapsible>
                          </Box>
                        </Collapse>
                      </TableCell>
                    )}
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  colSpan={type === "goals" ? 5 : type === "nutrition" ? 6 : 5}
                  count={data.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </ThemeProvider>
    </div>
  );
}

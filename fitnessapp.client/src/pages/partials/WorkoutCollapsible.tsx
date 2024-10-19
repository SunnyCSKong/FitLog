import React from "react";

function WorkoutCollapsible({ row }) {
  return (
    <>
      {row.sportType && <div>Sport Type: {row.sportType}</div>}
      {row.distance && <div>Distance: {row.distance}</div>}
      {row.exercises && (
        <div>
          <strong>Exercises:</strong>
          <ul>
            {row.exercises.map((exercise, index) => (
              <li key={index}>
                {exercise.name}: {exercise.sets} sets x {exercise.reps} reps @{" "}
                {exercise.weight} lbs
              </li>
            ))}
          </ul>
        </div>
      )}
      {row.notes && <div>Notes: {row.notes}</div>}
    </>
  );
}

export default WorkoutCollapsible;

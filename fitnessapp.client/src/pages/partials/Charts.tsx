import { axisClasses, BarChart, Gauge, gaugeClasses } from "@mui/x-charts";
import { useEffect, useState } from "react";

const getWorkoutsPerWeek = (workouts) => {
  const now = new Date();
  const weekCounts = [0, 0, 0, 0]; // Last 4 weeks

  workouts.forEach((workout) => {
    const workoutDate = new Date(workout.date);
    const weekIndex = Math.floor(
      (now.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24 * 7)
    );

    if (weekIndex >= 0 && weekIndex < 4) {
      weekCounts[weekIndex]++;
    }
  });

  // Calculate the date range for each of the last 4 weeks
  const weekLabels = [];
  for (let i = 0; i < 4; i++) {
    const startOfWeek = new Date(now);
    startOfWeek.setDate(startOfWeek.getDate() - (i + 1) * 7); // Start of week
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6); // End of week

    // Format date range
    const formattedRange = `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`;
    weekLabels.push(formattedRange);
  }

  // Reverse both weekCounts and weekLabels
  weekCounts.reverse();
  weekLabels.reverse();

  return { weekCounts, weekLabels };
};
export default function WorkoutsBarChart({ size, className, workouts }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const { weekCounts, weekLabels } = getWorkoutsPerWeek(workouts);
    const formattedData = weekLabels.map((weekLabel, index) => ({
      week: weekLabel,
      count: weekCounts[index],
    }));
    setData(formattedData);
  }, [workouts]);

  return (
    <div className={className}>
      <BarChart
        dataset={data}
        series={[{ dataKey: "count", label: "Workouts", stack: "workouts" }]}
        xAxis={[
          {
            scaleType: "band",
            dataKey: "week",
            valueFormatter: (week, context) => {
              const [start, end] = week.split(" - ");
              return context.location === "tick" ? `${start}\n${end}` : week;
            },
          },
        ]}
        yAxis={[{ dataKey: "count" }]}
        width={size * 1.7}
        height={size}
        slotProps={{ legend: { hidden: true } }}
        sx={{
          [`.${axisClasses.root}`]: {
            [`.${axisClasses.tick}, .${axisClasses.line}`]: {
              stroke: "#ffffff",
              strokeWidth: 3,
            },
            [`.${axisClasses.tickLabel}`]: {
              fill: "#ffffff",
            },
          },
        }}
      />
    </div>
  );
}

export function GaugeChart({ caloriesEaten, userCalories, gaugeSize }) {
  return (
    <Gauge
      width={gaugeSize}
      height={gaugeSize}
      value={caloriesEaten}
      valueMin={0}
      valueMax={userCalories}
      cornerRadius="50%"
      sx={(theme) => ({
        [`& .${gaugeClasses.valueText}`]: {
          fontSize: 40,
        },
        [`& .${gaugeClasses.valueText} text`]: {
          fill: "#ffffff", // <-- change text color
        },
        [`& .${gaugeClasses.referenceArc}`]: {
          fill: theme.palette.text.disabled,
        },
      })}
      text={({ value, valueMax }) => `${value} / ${valueMax}`}
      className="chart-item"
    />
  );
}

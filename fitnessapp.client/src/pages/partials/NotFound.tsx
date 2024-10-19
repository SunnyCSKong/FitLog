import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "70vh",
        textAlign: "center",
      }}
    >
      <div>
        <h2>Page not found!</h2>
        <p>
          Go to the <Link to="/">Home</Link> page
        </p>
      </div>
    </div>
  );
}

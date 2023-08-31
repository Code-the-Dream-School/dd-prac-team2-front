import { Link } from "react-router-dom";

function SessionDetailsRender({ id }) {
  return (
    <Link
      to={`/mentor/session/${id}`}
      style={{
        paddingInline: "6px",
        paddingBlock: "4px",
        borderRadius: "4px",
        color: "white",
        backgroundColor: "#609966",
        "&:hover": {
          backgroundColor: "#C84B31",
          transform: "scale(1.05)",
          transition: "all 0.2s ease-in-out",
        },
      }}
    >
      Details
    </Link>
  );
}

export default SessionDetailsRender;

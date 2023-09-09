import { Link, useOutletContext } from "react-router-dom";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import AppButton from "../../../../components/Button/AppButton";
import { Box } from "@mui/material";

function MentorSessionsActions({ id, removeSession, onLoading, onToast }) {
  const axiosPrivate = useAxiosPrivate();
  const [cohort] = useOutletContext();

  const handleDelete = async () => {
    if (window.confirm("The session will be removed. Proceed?")) {
      onLoading(true);
      const req = await axiosPrivate.delete(`/session/${cohort._id}/${id}`);
      if (req.status === 200) {
        onToast({
          isOpened: true,
          severity: "success",
          message: `Success! The session has been deleted`,
        });
        removeSession(id);
        onLoading(false);
      }
      onLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
      <Link
        to={`/mentor/session/${id}`}
        style={{
          paddingInline: "8px",
          paddingBlock: "8px",
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
        DETAILS
      </Link>
      <AppButton
        text="Remove"
        type="button"
        width="auto"
        color="#CD1818"
        handlerFunction={handleDelete}
      ></AppButton>
    </Box>
  );
}

export default MentorSessionsActions;

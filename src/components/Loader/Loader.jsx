/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import {
  Box,
  Typography,
  Backdrop,
  CircularProgress,
  styled,
} from "@mui/material";
/*
      ==========================
      =     REACT LIBRARIES    =
      ==========================
  */
import React, { useState } from "react";

const StyledLoader = styled(CircularProgress)(() => ({
  color: "#C84B31",
}));

const Loader = ({}) => {
  const [loading, setLoading] = useState(true); // Set this to false when the loading is complete
  return (
    <div>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        alignContent="center"
        position="relative" // Ensure the backdrop covers the entire container
      >
        <Backdrop
          open={loading}
          sx={{ zIndex: 1, backgroundColor: "rgba(22,33,62, 0.2)" }}
        >
          <StyledLoader size="4rem" />
          <Typography
            variant="h6"
            style={{ color: "#C84B31", padding: "1rem" }}
          >
            <b>Loading...</b>
          </Typography>
        </Backdrop>
      </Box>
    </div>
  );
};

export default Loader;

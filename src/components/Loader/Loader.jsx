/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
// import { CircularProgress, styled } from "@mui/material";
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
// import React from "react";

// const StyledLoader = styled(CircularProgress)(() => ({}));

// const Loader = ({
//   color,
//   disableShrink,
//   size,
//   thickness,
//   value,
//   variant,
//   handlerFunction,
// }) => {
//   return <StyledLoader size="4rem" />;
// };

// export default Loader;

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

const StyledLoader = styled(CircularProgress)(() => ({}));

const Loader = ({
  color,
  disableShrink,
  size,
  thickness,
  value,
  variant,
  handlerFunction,
}) => {
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
        <Backdrop open={loading} style={{ zIndex: 1 }}>
          <StyledLoader size="4rem" />
          <Typography
            variant="h6"
            style={{ color: "#1976D2", padding: "1rem" }}
          >
            <b>Loading...</b>
          </Typography>
        </Backdrop>
      </Box>
    </div>
  );
};

export default Loader;

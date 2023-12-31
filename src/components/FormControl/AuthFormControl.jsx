/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React from "react";
/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { FormControl, styled } from "@mui/material";
import PropTypes from "prop-types";
/*
    ==========================
    =    STYLED COMPONENTS   =
    ==========================
*/
const StyledAuthFormControl = styled(FormControl)(() => ({
  //Display
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: "15px",
  //Spacing
  padding: "5px",
}));

const AuthFormControl = ({ children, width, isNested, error = false }) => {
  return (
    <StyledAuthFormControl
      sx={{ width, padding: isNested ? "0px" : "5px" }}
      error={error ? true : false}
    >
      {children}
    </StyledAuthFormControl>
  );
};

export default AuthFormControl;

AuthFormControl.propTypes = {
  children: PropTypes.node.isRequired,
  width: PropTypes.string.isRequired,
  isNested: PropTypes.bool,
  error: PropTypes.bool,
};

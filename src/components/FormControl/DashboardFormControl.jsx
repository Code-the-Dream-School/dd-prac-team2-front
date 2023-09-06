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
const StyledDashboardFormControl = styled(FormControl)(() => ({
  //Display
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "15px",
  //Spacing
  padding: "5px",
}));

const DashboardFormControl = ({ children, width, isNested, error = false }) => {
  return (
    <StyledDashboardFormControl
      sx={{ width, padding: isNested ? "0px" : "5px", flexDirection: {sm: "column", md: "row"} }}
      error={error ? true : false}
    >
      {children}
    </StyledDashboardFormControl>
  );
};

export default DashboardFormControl;

DashboardFormControl.propTypes = {
  children: PropTypes.node.isRequired,
  width: PropTypes.string.isRequired,
  isNested: PropTypes.bool,
  error: PropTypes.bool,
};

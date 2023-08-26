/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { LocalLibraryRounded } from "@mui/icons-material";
import { Button, Icon, styled } from "@mui/material";
import PropTypes from "prop-types";
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React from "react";
/*
    ==========================
    =    STYLED COMPONENTS   =
    ==========================
*/
const StyledButton = styled(Button)(() => ({
  /* Display */
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "3px",
  /* Spacing */
  marginTop: "0px",
  marginBottom: "0px",
  marginRight: "1px",
  padding: "16px",
  /* Colors */
  color: "white",
  "&:hover": {
    backgroundColor: "#C84B31",
  },
  "&:focus": {
    backgroundColor: "#C84B31",
  },
}));

const NavigationBarButton = ({ text, iconComponent, onDrawerToggling }) => {
  return (
    <StyledButton
      key={text}
      onClick={(event) => onDrawerToggling(false, event)}
      disableFocusRipple
    >
      {iconComponent}
      {text}
    </StyledButton>
  );
};

export default NavigationBarButton;

NavigationBarButton.propTypes = {
  text: PropTypes.string.isRequired,
  iconComponent: PropTypes.node.isRequired,
  onDrawerToggling: PropTypes.func.isRequired,
};

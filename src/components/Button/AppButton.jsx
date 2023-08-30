/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { Button, Icon, styled } from "@mui/material";
import PropTypes from "prop-types";
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React from "react";

const StyledButton = styled(Button)(() => ({
  transform: "scale(1.0)",
  transition: "all 0.2s ease-in-out",
}));

const AppButton = ({
  children,
  text,
  type,
  width,
  height,
  color="#C84B31",
  textColor,
  handlerFunction,
}) => {
  const handleOnClick = () => {
    handlerFunction();
  };
  return (
    <StyledButton
      key={text}
      type={type}
      sx={{
        my: 0,
        mx: 0,
        color: textColor ? textColor : "white",
        backgroundColor: color ? color : "#C84B31",
        border: textColor ? `2px solid ${textColor}` : `2px solid ${color}`,
        width: width,
        display: "flex",
        alignItems: "center",
        gap: "5px",
        "&:hover": {
          backgroundColor: color ? color : "#C84B31",
          transform: "scale(1.05)",
          transition: "all 0.2s ease-in-out",
        },
      }}
      onClick={handleOnClick}
      disableFocusRipple
    >
      {children}
      {text}
    </StyledButton>
  );
};

export default AppButton;

AppButton.propTypes = {
  children: PropTypes.node,
  text: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  color: PropTypes.string,
  handlerFunction: PropTypes.func.isRequired,
};

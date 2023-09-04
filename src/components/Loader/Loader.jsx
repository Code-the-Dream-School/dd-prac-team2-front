/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { CircularProgress, styled } from "@mui/material";
import PropTypes from "prop-types";
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React from "react";

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
  return (
    <StyledLoader
      color={color}
      disableShrink={disableShrink}
      size={size}
      thickness={thickness}
      value={value}
      variant={variant}
    />
  );
};

export default Loader;

Loader.propTypes = {
  classes: PropTypes.object,
  color: PropTypes.string,
  disableShrink: PropTypes.bool,
  size: PropTypes.func || PropTypes.string,
  //   sx: (PropTypes.array < func) | object | (bool > PropTypes.func) | object,
  thickness: PropTypes.number,
  value: PropTypes.number,
  variant: PropTypes.oneOf(["determinate", "indeterminate"]),
  handlerFunction: PropTypes.func,
};

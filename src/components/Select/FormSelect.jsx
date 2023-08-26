/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import PropTypes from "prop-types";

/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import { FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";

const FormSelect = ({
  id,
  name,
  label,
  selectValue,
  onSelectValue,
  list,
  variant,
  multiple,
  error,
}) => {
  console.log(selectValue);
  /*
    ==========================
    =       HANDLERS         =
    ==========================
*/
  const handleChange = (event) => {
    onSelectValue(event.target.value);
  };
  return (
    <>
      <InputLabel
        id={label}
        sx={{
          color: variant === "light" ? "white" : "black",
          fontWeight: "bold",
          "&.Mui-focused": { color: variant === "light" ? "white" : "black" },
        }}
      >
        {label}
      </InputLabel>
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <Select
          multiple={multiple ? true : false}
          fullWidth
          label={label}
          labelId={label}
          id={id}
          name={name}
          value={selectValue}
          onChange={handleChange}
          sx={{
            "& fieldset": {
              borderColor: "#0F3460",
              borderWidth: 2,
              transition: "0.2s ease-in-out",
            },
            "&:hover": {
              "&& fieldset": {
                border: "2px solid #C84B31",
              },
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: "2px solid #C84B31",
            },
            "&, & .MuiSvgIcon-root": {
              color: variant === "light" ? "white" : "black",
              fontWeight: "bold",
            },
          }}
          required
        >
          {list.map((selectItem) => {
            return (
              <MenuItem
                key={selectItem}
                value={selectItem}
                sx={{
                  "&:hover, &:focus, &:focus:hover, &.Mui-selected.Mui-focusVisible, &.Mui-selected, &.Mui-selected:hover":
                    {
                      bgcolor: "#C84B31",
                      color: "white",
                      borderBottom: "1px solid #1A1A2E",
                    },
                }}
              >
                {selectItem}
              </MenuItem>
            );
          })}
        </Select>
        <FormHelperText>{error.error ? error.errorMessage : ""}</FormHelperText>
      </div>
    </>
  );
};

export default FormSelect;

FormSelect.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  selectValue: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  onSelectValue: PropTypes.func.isRequired,
  list: PropTypes.array.isRequired,
  variant: PropTypes.string.isRequired,
  multiple: PropTypes.bool,
  error: PropTypes.object.isRequired,
};

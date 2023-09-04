/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { Autocomplete, TextField } from "@mui/material";
import PropTypes from "prop-types";
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React from "react";

const FormAutocomplete = ({
  multiple,
  value,
  computedProperty,
  computedIdProperty,
  onHandleSelectedValueChange,
  inputValue,
  onHandleInputValueChange,
  options,
  error,
  variant,
}) => {
  return (
    <Autocomplete
      disableCloseOnSelect={multiple}
      multiple={multiple}
      limitTags={multiple ? 2 : 0}
      options={options}
      value={value}
      getOptionLabel={(option) => {
        return option[computedProperty];
      }}
      isOptionEqualToValue={(option, value) => option[computedProperty] === value[computedProperty]}
      onChange={(event, newValue) => {
        onHandleSelectedValueChange(newValue);
      }}
      inputValue={inputValue}
      onInputChange={(event, newValue) => {
        onHandleInputValueChange(newValue);
      }}
      ListboxProps={{ style: { maxHeight: 200, overflow: "auto" } }}
      sx={{
        width: "100%",
        "& .MuiFormControl-root": {
          label: {
            color: error.error
              ? "red"
              : variant === "light"
              ? "white"
              : "black",
            fontWeight: "bold",
          },
          ".MuiInputBase-root": {
            color: error.error
              ? "red"
              : variant === "light"
              ? "white"
              : "black",
            fontWeight: "bold",
            fieldset: {
              color: "white",
              fontWeight: "bold",
              border: error.error ? "2px solid red" : "2px solid #0F3460",
              transition: "ease-in-out 0.2s",
            },
          },
          ".MuiInputBase-root:hover": {
            fieldset: {
              border: error.error ? "2px solid red" : "2px solid #C84B31",
              transition: "ease-in-out 0.2s",
            },
          },
          ".MuiInputBase-root.Mui-focused": {
            fieldset: {
              border: error.error ? "2px solid red" : "2px solid #C84B31",
              transition: "ease-in-out 0.2s",
            },
          },
          ".MuiChip-root": {
            backgroundColor: "#0F3460",
            ".MuiChip-label, svg": {
              color: "white",
            },
          },
          ".MuiAutocomplete-endAdornment": {
            ".MuiIconButton-root": {
              color: variant === "light" ? "white" : "black",
              fontWeight: "bold",
            },
          },
        },
      }}
      renderOption={(props, option) => {
        return (
          <li {...props} key={option[computedIdProperty]}>
            {option[computedProperty]}
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="Cohort"
          error={error.error}
          helperText={error.error ? error.errorMessage : " "}
        ></TextField>
      )}
    ></Autocomplete>
  );
};

export default FormAutocomplete;

FormAutocomplete.propTypes = {
  multiple: PropTypes.bool.isRequired,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  computedProperty: PropTypes.string,
  computedIdProperty: PropTypes.string,
  onHandleSelectedValueChange: PropTypes.func.isRequired,
  inputValue: PropTypes.string.isRequired,
  onHandleInputValueChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  error: PropTypes.object.isRequired,
  variant: PropTypes.string.isRequired,
}

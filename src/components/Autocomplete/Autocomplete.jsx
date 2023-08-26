import React from "react";
import { Autocomplete, TextField } from "@mui/material";

const FormAutocomplete = ({
  multiple,
  value,
  onHandleSelectedValueChange,
  inputValue,
  onHandleInputValueChange,
  options,
  error,
  variant,
}) => {
  console.log(value, options);
  return (
    <Autocomplete
      disableCloseOnSelect={multiple}
      multiple={multiple}
      limitTags={multiple ? 2 : 0}
      options={options}
      value={value}
      getOptionLabel={(option) => {
        console.log(option);
        return option.cohort;
      }}
      isOptionEqualToValue={(option, value) => option.cohort === value.cohort}
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

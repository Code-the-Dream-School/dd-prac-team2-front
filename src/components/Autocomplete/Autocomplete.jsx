import React from 'react';
import {Autocomplete, TextField} from "@mui/material";

const FormAutocomplete = ({value, onHandleSelectedValueChange, inputValue, onHandleInputValueChange, options, error}) => {
    console.log(error);
    return (
        <Autocomplete
            disablePortal
            disableCloseOnSelect
            multiple
            limitTags={2}
            value={value}
            getOptionLabel={(option) => option.cohort}
            onChange={(event, newValue) => {
                onHandleSelectedValueChange(newValue);
            }}
            inputValue={inputValue}
            onInputChange={(event, newValue)=>{
                onHandleInputValueChange(newValue);
            }}
            options={options}
            sx={
                {
                    width: "100%", 
                    "& .MuiFormControl-root":{
                        "label":{
                            color: error.error ? "red":"white",
                            fontWeight:"bold",
                        },
                        ".MuiInputBase-root":{
                            color: error.error ? "red":"white",
                            fontWeight:"bold",
                            "fieldset":{
                                color:"white",
                                fontWeight:"bold",
                                border: error.error ? "2px solid red":"2px solid #0F3460",
                                transition: "ease-in-out 0.2s",
                            }
                        },
                        ".MuiInputBase-root:hover":{
                            "fieldset": {
                                border: error.error ? "2px solid red":"2px solid #0F3460",
                                transition: "ease-in-out 0.2s",
                            }
                        },
                        ".MuiInputBase-root.Mui-focused":{
                            "fieldset": {
                                border: error.error ? "2px solid red":"2px solid #0F3460",
                                transition: "ease-in-out 0.2s",
                            }
                        },
                        ".MuiChip-root":{
                            backgroundColor:"#0F3460",
                            ".MuiChip-label, svg": {
                                color: "white"
                            }
                        },
                        ".MuiAutocomplete-endAdornment":{
                            ".MuiIconButton-root":{
                                color:"white",
                                fontWeight:"bold"
                            }
                        }
                    }
                }
            }
            renderInput={(params)=>(<TextField {...params} variant='outlined' label="Cohort" error={error.error} helperText={error.error ? error.errorMessage : " "} required></TextField>)}
        >
        </Autocomplete>
    )
};

export default FormAutocomplete;
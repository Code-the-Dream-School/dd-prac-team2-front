import { DatePicker } from '@mui/x-date-pickers';
import PropTypes from "prop-types";

import React, { useState } from 'react';

const AppDatePicker = ({id, name, label, dateValue, onDateValueChange, minDate, variant}) => {
    /*
        ==========================
        =         STATES         =
        ==========================
    */
   const [error, setError] = useState(" ");
    /*
        ==========================
        =         HANDLERS       =
        ==========================
    */
    const handleValueChange = (event) => {
        onDateValueChange(event);
    }
    return (
        <DatePicker 
            sx={
                {   
                    width:"100%", 
                    "label":{
                        fontWeight: "bold",
                        color: variant === "light" ? "white" : "black",
                        "&.Mui-focused":{
                            color: variant === "light" ? "white" : "black"
                        }
                    },
                    "& fieldset":{
                        borderColor: "#0F3460", 
                        borderWidth: 2,
                        transition: "ease-in-out 0.2s"
                    },
                    "& .Mui-fcosued fieldset.MuiOutlinedInput-notchedOutLine":{
                        borderColor: "#C84B31", 
                        borderWidth: 2,
                        transition: "ease-in-out 0.2s"
                    },
                    "&:hover": {
                        "&& fieldset": {
                            border: "2px solid #C84B31",
                            transition: "ease-in-out 0.2s"
                        }
                    },
                    "&, & .MuiSvgIcon-root":{
                        color: variant === "light" ? "white" : "black", 
                        fontWeight:"bold"
                    },
                    '& .MuiOutlinedInput-root': {
                        fontWeight:"bold",
                        color: variant === "light" ? "white" : "black",
                        '&.Mui-focused fieldset': {
                            borderColor: '#C84B31',
                        },
                        },
                }
            }
            slotProps={{
                leftArrowIcon: {
                    sx:{
                        fontWeight:"bold",
                        color:"#C84B31"
                    }
                },
                rightArrowIcon: {
                    sx:{
                        fontWeight:"bold",
                        color:"#C84B31"
                    }
                },
                day: {
                    sx: {
                    "&.MuiPickersDay-root.MuiPickersDay-today": {
                        color: "white",
                        backgroundColor: "#1A1A2E",
                        border: 0
                        },
                    "&.MuiPickersDay-root.Mui-selected": {
                        backgroundColor: "#C84B31",
                    },
                    "&.MuiPickersDay-root:hover": {
                        color:"white",
                        backgroundColor: "#C84B31",
                        },
                    },
                },
                year: {
                    sx: {
                        color:"red"
                    }
                },
                textField: {
                    required: true,
                    helperText: error==="minDate" ? "Invalid date" : error
                },
                }}
            id={id}
            name={name}
            label={label} 
            inputFormat="dd-MM-yyyy"
            value={dateValue}
            onChange={handleValueChange}
            minDate={minDate}
            onError={(newError) => newError ? setError(newError) : setError(" ")}
        />                            
    )
}

export default AppDatePicker;

AppDatePicker.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    dateValue: PropTypes.object.isRequired,
    onDateValueChange: PropTypes.func.isRequired,
    minDate: PropTypes.object,
    variant: PropTypes.string.isRequired
};
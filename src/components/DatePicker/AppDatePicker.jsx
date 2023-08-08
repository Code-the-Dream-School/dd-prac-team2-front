import { DatePicker } from '@mui/x-date-pickers';
import PropTypes from "prop-types";

import React from 'react';

const AppDatePicker = ({label}) => {
    return (
        <DatePicker 
            sx={
                {   
                    width:"100%", 
                    "label":{
                        fontWeight: "bold",
                        color:"white",
                        "&.Mui-focused":{
                            color:"white"
                        }
                    },
                    "& fieldset":{
                        borderColor: "#0F3460", 
                        borderWidth: 2
                    },
                    "& .Mui-fcosued fieldset.MuiOutlinedInput-notchedOutLine":{
                        borderColor: "#C84B31", 
                        borderWidth: 2
                    },
                    "&:hover": {
                        "&& fieldset": {
                            border: "2px solid #C84B31"
                        }
                    },
                    "&, & .MuiSvgIcon-root":{
                        color:"white", 
                        fontWeight:"bold"
                    },
                    '& .MuiOutlinedInput-root': {
                        fontWeight:"bold",
                        color: "white",
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
                        backgroundColor: "#C84B31",
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
                },
                }}
            label={label} 
        />                            
    )
}

export default AppDatePicker;

AppDatePicker.propTypes = {
    label: PropTypes.string.isRequired
};
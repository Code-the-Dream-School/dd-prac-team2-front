/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { TextField } from '@mui/material';
import PropTypes from 'prop-types';
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React, { useState } from 'react';

const FormTextField = ({required, type, label, name, isFocused, width, variant}) => {
    /*
        ==========================
        =         STATES         =
        ==========================
    */  
    const [text, setText] = useState("");
    /*
        ==========================
        =        HANDLERS        =
        ==========================
    */  
    const handleTextChange = (event) => {
        setText(event.target.value);
    }
    
    return (
        <TextField
            required={required}
            type={type}
            id={label}
            name={name}
            label={label}
            value={text}
            onChange={handleTextChange}
            sx={{
                width: width,
                "& label": { color: variant==="light" ? "white":"#1A1A2E"},
                "& label.Mui-focused": {
                    color: variant==="light" ? "white":"#1A1A2E"
                },
                "& .MuiOutlinedInput-root fieldset": {
                    borderWidth: 2,
                    transition: "ease-in-out 0.2s",
                },
                "& .MuiOutlinedInput-root:hover fieldset": {
                    borderWidth: 2,
                    borderColor: "#C84B31",
                    transition: "ease-in-out 0.2s",
                },
                "& .MuiOutlinedInput-root input": {
                    color: variant==="light" ? "white" : "#1A1A2E"
                },
                "& .MuiOutlinedInput-root" : {
                    "& input:":{color: variant==="light" ? "white" : "#1A1A2E"},
                    "&.Mui-focused input": {color: variant==="light" ? "white" : "#1A1A2E"},
                    "& fieldset": {borderColor:"#0F3460"},
                    "&.Mui-focused fieldset" : {borderColor: "#C84B31"}
                }
            }}
            inputRef={(input) => (input && isFocused) && input.focus()}
        />
    );
}

export default FormTextField;

FormTextField.propTypes = {
    required: PropTypes.bool.isRequired,
    type: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    isFocused: PropTypes.bool.isRequired,
    width: PropTypes.string.isRequired,
    variant: PropTypes.string.isRequired
};
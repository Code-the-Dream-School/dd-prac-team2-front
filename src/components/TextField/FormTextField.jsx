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
import React, { memo, useEffect, useState } from 'react';

const FormTextField = ({required, type, label, name, isFocused, width, variant, regex, onHandleError, reset}) => {
    /*
        ==========================
        =         STATES         =
        ==========================
    */  
    const [text, setText] = useState("");
    const [error, setError] = useState(false);
    /*
        ==========================
        =        EFFECTS         =
        ==========================
    */  
    useEffect(()=>{
        if(reset){
            setText("");
        }
    }, [reset]);
    /*
        ==========================
        =        HANDLERS        =
        ==========================
    */  
    const handleTextChange = (event) => {
        setText(event.target.value);
        if(regex){
            const matchRegex = (event.target.value).match(regex);
            if(!matchRegex){
                setError(true);
                onHandleError(true);
            }
            else{
                setError(false);
                onHandleError(false);
            }
        }
    }
    
    return (
        <TextField
            error={error}
            required={required}
            type={type}
            id={name}
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
                    borderWidth: error ? 4:2,
                    borderColor: error ? "error" : "#C84B31",
                    transition: "ease-in-out 0.2s",
                },
                "& .MuiOutlinedInput-root input": {
                    color: variant==="light" ? "white" : "#1A1A2E"
                },
                "& .MuiOutlinedInput-root" : {
                    "& input:":{color: variant==="light" ? "white" : "#1A1A2E"},
                    "&.Mui-focused input": {color: variant==="light" ? "white" : "#1A1A2E"},
                    "& fieldset": {borderColor:"#0F3460"},
                    "&.Mui-focused fieldset" : {borderColor: error ? "error":"#C84B31", borderWidth: error ? 4:2}
                }
            }}
            inputRef={(input) => (input && isFocused) && input.focus()}
        />
    );
}

export default memo(FormTextField);

FormTextField.propTypes = {
    required: PropTypes.bool.isRequired,
    type: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    isFocused: PropTypes.bool.isRequired,
    width: PropTypes.string.isRequired,
    variant: PropTypes.string.isRequired,
    regex: PropTypes.any,
    onHandleError: PropTypes.func,
    reset: PropTypes.bool.isRequired
};
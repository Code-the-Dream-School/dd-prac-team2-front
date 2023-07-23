/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { TextField } from '@mui/material'
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React, { useState } from 'react'

const FormTextField = ({required, type, label, name}) => {
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
                "& label": { color: "white"},
                "& label.Mui-focused": {
                    color: "#FFFFFF"
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
                    color:"white"
                },
                "& .MuiOutlinedInput-root" : {
                    "& input:":{color:"white"},
                    "&.Mui-focused input": {color:"white"},
                    "& fieldset": {borderColor:"#0F3460"},
                    "&.Mui-focused fieldset" : {borderColor: "#C84B31"}
                }
            }}
        />
    );
}

export default FormTextField
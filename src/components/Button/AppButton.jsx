/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { Button, Icon, styled } from '@mui/material'
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React from 'react'

const AppButton = ({children, text, type, handlerFunction}) => {
    const StyledButton = styled(Button)(() => ({
        backgroundColor: "#C84B31",
        width: "100%",
        transform: "scale(1.0)",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
            backgroundColor: "#C84B31",
            transform: "scale(1.05)",
            transition: "all 0.2s ease-in-out"
        },
    }));

    const handleOnClick = () => {
        handlerFunction();
    }

    return (
        <StyledButton 
            key={text}
            type={type} 
            sx={{my:0, mx:0, color: "white", display:"flex", alignItems:"center", gap:"5px"}}
            onClick={handleOnClick}
            disableFocusRipple
        >
            {children}
            {text}
        </StyledButton>
    )
}

export default AppButton
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React from 'react'
/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { FormControl, styled } from '@mui/material';

const AuthFormControl = ({children}) => {
    /*
        ==========================
        =    STYLED COMPONENTS   =
        ==========================
    */
   const StyledAuthFormControl = styled(FormControl)(()=>({
    //Display
    display: "flex",
    flexDirection:"row",
    alignItems:"center",
    gap:"10px",
    //Spacing
    padding: "5px"
   }));
    return (
       <StyledAuthFormControl>
            {children}
       </StyledAuthFormControl> 
    );
}

export default AuthFormControl;
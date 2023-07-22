/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { LocalLibraryRounded } from '@mui/icons-material';
import { Button, Icon, styled } from '@mui/material'
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React from 'react'

const NavigationBarButton = ({text, onDrawerToggling}) => {
    const StyledButton = styled(Button)(() => ({
        "&:hover": {
            backgroundColor: "#C84B31"
        },
        '&:focus':{
            backgroundColor: '#C84B31'
        },
    }));

    return (
        <StyledButton 
            key={text} 
            onClick={(event)=>onDrawerToggling(false, event)} 
            sx={{my:0, mx:0, color: "white", display:"flex", alignItems:"center"}}
            disableFocusRipple
        >
            <LocalLibraryRounded></LocalLibraryRounded>
            {text}
        </StyledButton>
    )
}

export default NavigationBarButton
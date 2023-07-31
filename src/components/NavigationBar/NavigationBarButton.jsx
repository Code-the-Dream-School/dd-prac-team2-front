/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { LocalLibraryRounded } from '@mui/icons-material';
import { Button, Icon, styled } from '@mui/material';
import PropTypes from 'prop-types';
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React from 'react';

/*
    ==========================
    =         STYLES         =
    ==========================
*/
const StyledButton = styled(Button)(() => ({
    "&:hover": {
        backgroundColor: "#C84B31"
    },
    '&:focus':{
        backgroundColor: '#C84B31'
    },
}));

const NavigationBarButton = ({text, onDrawerToggling}) => {
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

export default NavigationBarButton;

NavigationBarButton.propTypes = {
    text: PropTypes.string.isRequired,
    onDrawerToggling: PropTypes.func.isRequired,
};
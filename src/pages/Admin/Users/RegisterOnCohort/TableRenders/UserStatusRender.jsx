/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { Chip, Container } from '@mui/material';
import PropTypes from "prop-types";

/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React from 'react';

const UserStatusRender = ({params}) => {
    const status = params.row.userActivatedStatus;
    return (
        <Container sx={{display:"flex", flexDirection:"row", gap:"5px", "&":{paddingLeft:0, paddingRight:0}, paddingLeft:0}}>
        <Chip 
            label={status === true ? "Active" : "Inactive"} 
            sx={
                {
                    backgroundColor: status===true ? "#609966" : "#CD1818",
                    color: "white",
                    fontWeight: "bold"
                }
            }
        />          
        </Container>
    );
};

export default UserStatusRender;

UserStatusRender.propTypes = {
    params: PropTypes.object.isRequired,
};
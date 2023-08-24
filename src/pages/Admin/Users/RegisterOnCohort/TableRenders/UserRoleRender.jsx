/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { Chip, Container, Stack } from '@mui/material';
import PropTypes from "prop-types";

/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React from 'react';

const UserRoleRender = ({params}) => {
    const roles = params.row.userRole;
    
    return (
        <Container sx={{display:"flex", flexDirection:"row", gap:"5px", "&":{paddingLeft:0, paddingRight:0}, paddingLeft:0}}>
            <Stack direction={"row"} spacing={1}>
                {
                    roles.map((role)=> 
                        (
                            <Chip 
                                key={`${role}-${params.row.userId}`} 
                                label={role} 
                                sx={
                                    {
                                        backgroundColor: role==="admin" ? "#B8621B" : role==="mentor" ? "#609966" : "#0F3460",
                                        color: "white",
                                        fontWeight: "bold",
                                        textTransform: "capitalize"
                                    }
                                }
                            />
                        )
                    )
                }
            </Stack>
        </Container>
    );
};

export default UserRoleRender;

UserRoleRender.propTypes = {
    params: PropTypes.object.isRequired,
};
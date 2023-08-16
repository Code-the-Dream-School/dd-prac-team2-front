import { Chip, Container, Stack } from '@mui/material';
import React from 'react';

const UserRoleRender = ({params}) => {

    const roles = params.row.userRole;
    console.log(roles);
    return (
        <Container sx={{display:"flex", flexDirection:"row", gap:"5px", "&":{paddingLeft:0, paddingRight:0}, paddingLeft:0}}>
            <Stack direction={"row"} spacing={1}>
                {
                    roles.map((role)=> 
                        (
                            <Chip 
                                key={role} 
                                label={role} 
                                sx={
                                    {
                                        backgroundColor: role==="Admin" ? "#B8621B" : role==="Mentor" ? "#609966" : "#0F3460",
                                        color: "white",
                                        fontWeight: "bold"
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
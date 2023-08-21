/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { Chip, Container, Stack } from '@mui/material';
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React from 'react';

const UserCohortRender = ({params}) => {
    const userCohorts = params.row.userCohort;
    return (
    <Container sx={{display:"flex", flexDirection:"row", gap:"5px", "&":{paddingLeft:0, paddingRight:0}, paddingLeft:0}}>
            <Stack direction={"row"} spacing={1}>
                {
                    userCohorts.map((userCohort)=> 
                        (
                            <Chip 
                                key={`${userCohort.cohort}-${params.row.userId}`} 
                                label={userCohort.cohort} 
                                sx={
                                    {
                                        backgroundColor: "#0F3460",
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
    )
}

export default UserCohortRender
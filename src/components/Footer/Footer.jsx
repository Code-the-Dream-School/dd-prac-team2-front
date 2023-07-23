/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import {Avatar, Chip, Divider, Link, List, ListItem, Paper, Tooltip, Typography } from '@mui/material'
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React from 'react'
/*
    ==========================
    =         UTILS          =
    ==========================
*/
import { getCurrentYear } from '../../util'

const contributors = [
    {
        name: "Saul Castillo",
        picture:"https://avatars.githubusercontent.com/u/42615340?v=4",
        url: "https://github.com/secch97"
    },
    {    
        name: "Abebe Tesso",
        picture:undefined,
        url: "https://github.com/AbebeTesso"
    },
    {    
        name: "Tam Pham",
        picture:"https://avatars.githubusercontent.com/u/109603295?v=4",
        url: "https://github.com/Miminiverse"
    },
    {    
        name: "Carlos Paiva",
        picture:"https://avatars.githubusercontent.com/u/55894222?v=4",
        url: "https://github.com/cdpaiva"
    },
    {    
        name: "Aleksey K",
        picture:undefined,
        url: "https://github.com/akabishau"
    }
];

const Footer = () => {
  return (
    <Paper
        sx={
            {
                position: "fixed", 
                bottom: 0, 
                left: 0, 
                right: 0,
                bgcolor: "#1A1A2E"
            }
        }
        elevation={3}
    >
        <Typography 
            variant='body1' 
            display="flex" 
            justifyContent="center" 
            alignItems="center"
            flexDirection="column"
            sx={{color: "#FFFFFF", padding: "10px", textAlign:"center"}}
        >
            {`© MENTORUP ${getCurrentYear()} - ALL RIGHTS RESERVED`}
        </Typography>
        <Divider 
            flexItem 
            sx={
                {
                    "&::before, &::after": {
                        borderColor: "white",
                        borderWidth: '1px'
                    }
                }
            }
        >
            <Chip label="MADE BY" sx={{bgcolor:"#C84B31", color: "#FFFFFF"}}/>
        </Divider>
        <List sx={{display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"row", padding:1}}>
            {
                contributors.map((contributor)=>{
                    return(
                        <Tooltip key={contributor.name} title={contributor.name} placement="bottom" sx={{mx:1}}>
                            <Link href={contributor.url} target="_blank">
                                <Avatar alt={contributor.name} src={contributor.picture} />
                            </Link>
                        </Tooltip>
                    );
                })
            }
        </List>
    </Paper>
  )
}

export default Footer
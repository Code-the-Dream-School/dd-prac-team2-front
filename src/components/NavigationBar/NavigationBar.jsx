/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { AppBar, Avatar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material'
import { MenuRounded } from '@mui/icons-material';
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
/*
    ==========================
    =         STYLES         =
    ==========================
*/
import styles from "./NavigationBar.module.css";
/*
    ==========================
    =        VARIABLES       =
    ==========================
*/
const pages = ["Option1", "Option2", "Option3"];
const settings = ["Option1", "Option2", "Option3"];

const NavigationBar = ({auth}) => {
    /*
        ==========================
        =         STATES         =
        ==========================
    */
    //1. State used for nav-bar hamburguer menu position:
    const [anchorElNav, setAnchorElNav] = useState(null);
    //2. State used for user settings position:
    const [anchorElUser, setAnchorElUser] = useState(null);
    
    /*
        ==========================
        =        HANDLERS        =
        ==========================
    */
    //1. Handler for opening the nav-bar hamburguer menu.
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    }
    //2. Handler for opening the user settings menu.
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    }
    //3. Handler for closing the nav-bar hamburguer menu.
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    }
    //4. Handler for closing the user settings menu.
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    }

    /*
        ==========================
        =    COMPONENT RENDER    =
        ==========================
    */
    return (
        <AppBar position="fixed" sx={{bgcolor:"#1A1A2E"}}>
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{display:"flex", justifyContent: auth ? "space-between" : {xs: "center", md: "space-between"}}}>
                    {
                        auth && (
                            <Box sx={{display: {xs: "flex", md:"none"}}}>
                                <IconButton
                                    size="large"
                                    aria-label="Menu options for current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleOpenNavMenu}
                                    color="inherit"
                                >
                                    <MenuRounded/>
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorElNav}
                                    anchorOrigin={{vertical: "bottom", horizontal: "left"}}
                                    keepMounted
                                    transformOrigin={{vertical: "top", horizontal: "left"}}
                                    open={Boolean(anchorElNav)}
                                    onClose={handleCloseNavMenu}
                                    sx={{display: {xs: "block",md: "none"}}}
                                >
                                    {
                                        pages.map((page) => {
                                            return(
                                                <MenuItem key={page} onClick={handleCloseNavMenu}>
                                                    <Typography textAlign="center">
                                                        {page}
                                                    </Typography>
                                                </MenuItem>
                                            );
                                        })
                                    }
                                </Menu>
                            </Box>
                        )
                    }
                    <Box sx={{display: {xs: "flex", md:"flex"}, justifySelf:"center"}}>
                        <Link to="/" className={styles.MentorUpLogoLink} > 
                            <img className={styles.MentorUpLogo} src='/images/logo.png'/>                    
                        </Link>
                    </Box>
                    {
                        auth && (
                            <>
                                <Box sx={{flexGrow:1, display:{xs:"none", md:"flex"}}}>
                                    {
                                        pages.map((page) => {
                                            return(
                                                <Button key={page} onClick={handleCloseNavMenu} sx={{my:2, mx:2, color: "white", display:"block"}}>
                                                    {page}
                                                </Button>
                                            );
                                        })
                                    }
                                </Box>
                                <Box sx={{flexGrow: 0}}>
                                    <Tooltip title="Open settings">
                                        <IconButton onClick={handleOpenUserMenu} sx={{p:0}}>
                                            <Avatar alt="User profile picture" src="/images/user.png"/>
                                        </IconButton>
                                    </Tooltip>
                                    <Menu
                                        sx={{mt: "45px"}}
                                        id="menu-appbar"
                                        anchorEl={anchorElUser}
                                        anchorOrigin={{vertical: "top", horizontal: "right"}}
                                        keepMounted
                                        transformOrigin={{vertical:"top", horizontal: "right"}}
                                        open={Boolean(anchorElUser)}
                                        onClose={handleCloseUserMenu}
                                    >
                                        {
                                            settings.map((setting)=>{
                                                return(
                                                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                                        <Typography textAlign="center">
                                                            {setting}
                                                        </Typography>
                                                    </MenuItem>
                                                );
                                            })
                                        }
                                    </Menu>
                                </Box>
                            </>
                        )
                    }
                </Toolbar>
            </Container>
        </AppBar>
    )
}

export default NavigationBar
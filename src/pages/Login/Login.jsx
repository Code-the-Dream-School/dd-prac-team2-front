/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { Box, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, Paper, Slide, Typography } from '@mui/material';
import {Email, Google, LockRounded } from '@mui/icons-material';
import PropTypes from 'prop-types';
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React, {useState } from 'react';
/*
    ==========================
    =         STYLES         =
    ==========================
*/
import styles from './Login.module.css';
import FormTextField from '../../components/TextField/FormTextField';
import AppButton from '../../components/Button/AppButton';
import Register from '../Register/Register';

const Login = ({onAuth, onRegister}) => {
    /*
        ==========================
        =         STATES         =
        ==========================
    */
    const [openDialog, setOpenDialog] = useState(false);

    /*
        ==========================
        =        HANDLERS        =
        ==========================
    */
    //1. Form submit:
    const handleFormSubmit = (event) => {
        event.preventDefault();
        const userAuth = {
            email: event.target.email.value,
            password: event.target.password.value
        }
        onAuth(userAuth);
    }

    //2. Dialog opening & closing
    const handleOpenRegisterDialog = () => {
        setOpenDialog(true);
    }

    const handleCloseRegisterDialog = () => {
        setOpenDialog(false);
    }

    return (
        <>
            <Container maxWidth="sm" >
                <Paper 
                    elevation={3} 
                    sx={
                        {
                            display:"flex", 
                            flexDirection:"column", 
                            justifyContent:"center", 
                            alignItems:"center", 
                            bgcolor:"#1A1A2E", 
                            color: "#FFFFFF", 
                            borderRadius: "40px",
                            padding:2,
                            height:"auto",
                        }
                    }
                >
                    <img className={styles.loginPicture} alt="Picture for log in form" src="./images/scheduler-photo.png" />
                    <Box
                        component={"form"}
                        sx={{

                            display: "flex",
                            flexDirection: "column",
                            justifyContent:"center",
                            alignItems:"center",
                            width: "100%"
                        }}
                        autoComplete='off'
                        onSubmit={handleFormSubmit}
                    >
                        <div className={styles.formContainer}>
                            <Typography sx={{textAlign:"center", marginTop:"0px", marginBottom:"5px"}}>Sign in to MentorUp</Typography>
                            <FormControl sx={{display:"flex", flexDirection:"row",alignItems:"center", gap:"10px" ,padding: "5px"}}>
                                <Email fontSize="large"></Email>
                                <FormTextField required type="text" label="E-mail" name="email" isFocused={true} width="100%" variant="light"></FormTextField>
                            </FormControl>
                            <FormControl sx={{display:"flex", flexDirection:"row",alignItems:"center", gap:"10px", padding: "5px"}}>
                                <LockRounded fontSize="large"></LockRounded>
                                <FormTextField required type="password" label="Password" name="password" isFocused={false} width="100%" variant="light"></FormTextField>
                            </FormControl>
                            <AppButton text={"Sign in"} type="submit" width="100%" handlerFunction={()=>{}}>
                            </AppButton>
                            <AppButton text={"Sign in with Google"} type="submit" width="100%" handlerFunction={()=>{}}>
                                <Google></Google>
                            </AppButton>
                        </div>
                    </Box>
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
                        textAlign='center'
                    >
                        <Typography sx={{textAlign:"center", marginTop:"15px", marginBottom:"15px"}}>Don't have an account?</Typography>
                    </Divider>    
                    <div className={styles.formContainer}>
                        <AppButton text={"Register"} type="button" width="100%" handlerFunction={()=>{handleOpenRegisterDialog()}}/>
                    </div>
                </Paper>  
            </Container>
            <Register openDialog={openDialog} onCloseRegisterDialog={handleCloseRegisterDialog} onRegister={onRegister}/>
        </>
    )
}

export default Login;

Login.propTypes = {
    onAuth: PropTypes.func.isRequired,
    onRegister: PropTypes.func.isRequired
};
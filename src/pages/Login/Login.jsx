/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { Box, Container, Divider, Paper, Typography } from '@mui/material';
import {Email, Google, LockRounded } from '@mui/icons-material';
import PropTypes from 'prop-types';
import axios from "../../api/axios";
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React, {useState} from 'react';
import {Link, useNavigate, useLocation} from "react-router-dom";
/*
    ==========================
    =       CUSTOM HOOKS     =
    ==========================
*/
import useAuth from '../../hooks/useAuth';
/*
    ==========================
    =         STYLES         =
    ==========================
*/
import styles from './Login.module.css';
import FormTextField from '../../components/TextField/FormTextField';
import AppButton from '../../components/Button/AppButton';
import Register from '../Register/Register';
import AuthFormControl from '../../components/FormControl/AuthFormControl';

const Login = () => {
    /*
        ==========================
        =        CONTEXT         =
        ==========================
    */
   const {setAuth} = useAuth();
    /*
        ==========================
        =         STATES         =
        ==========================
    */
    const [openDialog, setOpenDialog] = useState(false);
    const [reset, setReset] = useState(false);
    /*
        ==========================
        =          HOOKS         =
        ==========================
    */
   const navigate = useNavigate();
   const location = useLocation();
   const from = location.state?.from?.pathname || "/";

    /*
        ==========================
        =        HANDLERS        =
        ==========================
    */
    //1. Form submit:
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const loggedUser = {
            email: (event.target.email.value.trim()).toLowerCase(),
            password: event.target.password.value.trim()
        };

        try{
            const response = await axios.post(`${process.env.REACT_APP_AUTH}/${process.env.REACT_APP_AUTH_LOGIN}`,
                loggedUser,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log(response);
            console.log(response.data);
            const userId = response.data.user.userId;
            const userName = response.data.user.name;
            const accessToken = response.data.token;
            console.log("Welcome: ", userName, userId);
            console.log("Access token: ", accessToken);
            setAuth({userId, userName, userEmail:loggedUser.email, role:"admin", loggedIn:true, accessToken});
            setReset(true);
            navigate(from, {replace: true});
        } catch(error){
            console.error(error.response.data);
        }
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
                            <AuthFormControl>
                                <Email fontSize="large"></Email>
                                <FormTextField required type="text" label="E-mail" name="email" isFocused={true} width="100%" variant="light" reset={reset}></FormTextField>
                            </AuthFormControl>
                            <AuthFormControl>
                                <LockRounded fontSize="large"></LockRounded>
                                <FormTextField required type="password" label="Password" name="password" isFocused={false} width="100%" variant="light" reset={reset}></FormTextField>
                            </AuthFormControl>
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
            <Register openDialog={openDialog} onCloseRegisterDialog={handleCloseRegisterDialog}/>
        </>
    )
}

export default Login;

Login.propTypes = {
};
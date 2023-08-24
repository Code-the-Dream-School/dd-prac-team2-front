/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { Box, Container, Paper, Typography } from '@mui/material';
import {Email, Google, LockRounded } from '@mui/icons-material';
import PropTypes from 'prop-types';
import axios from "../../api/axios";
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React, {useCallback, useState} from 'react';
import {useNavigate, useLocation} from "react-router-dom";
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
/*
    ==========================
    =       COMPONENTS       =
    ==========================
*/
import FormTextField from '../../components/TextField/FormTextField';
import AppButton from '../../components/Button/AppButton';
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
    const [reset, setReset] = useState(false);
    const [formError, setFormError] = useState({
        emailError: {
            error: false,
            errorMessage: "Please enter a valid email address."
        }
    });
    /*
        ==========================
        =          HOOKS         =
        ==========================
    */
   const navigate = useNavigate();
   const location = useLocation();
   const from = "/";

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
        const errors = Object.values(formError);
        try{
            if(!errors.some((error)=>error.error===true)){
                const response = await axios.post(`auth/login`,
                    loggedUser,
                    {
                        withCredentials: true,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                console.log(response.data);
                const userId = response.data.user.userId;
                const userName = response.data.user.name;
                const accessToken = response.data.token;
                const role = response.data.user.role;
                console.log("Welcome: ", userName, userId);
                console.log("Access token: ", accessToken);
                setAuth({userId, userName, userEmail:loggedUser.email, role, loggedIn:true, accessToken});
                setReset(true);
                navigate(from, {replace: true});
            }
            else{
                console.log("There is an error that is preventing the form submission", errors);
            }
        } catch(error){
            console.error(error.response.data);
        }
    }

    //2. Error handlers
    const handleEmailError = useCallback((inputError) => {
        setFormError(prevState => ({
            ...prevState,
            emailError: {
                ...prevState.emailError,
                error: inputError,
            }
        }));
    }, []);

    //3. Google log in
    const handleGoogleAuthUrl = () => {
        const rootURL = "https://accounts.google.com/o/oauth2/v2/auth"
        const options = {
            redirect_uri: "http://localhost:8000/auth/google/callback",
            client_id: "490168595790-ndo2sl33jv0mg0ehm7na8flj3fhpq0dr.apps.googleusercontent.com",
            access_type: "offline",
            response_type: "code",
            prompt: "consent",
            scope: [
                "https://www.googleapis.com/auth/userinfo.profile",
                "https://www.googleapis.com/auth/userinfo.email",
            ].join(" ")
        }
        const qs = new URLSearchParams(options)
        console.log(qs.toString());
        window.location.assign(`${rootURL}?${qs.toString()}`);
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
                            <AuthFormControl width="100%">
                                <Box sx={{display:"flex", flexDirection:"column", justifyContent:"center"}}>
                                    <Email fontSize="large"></Email>
                                    <br></br>
                                    <br></br>
                                </Box>
                                <FormTextField required type="text" label="E-mail" name="email" isFocused={true} width="100%" variant="light" regex={/^[^\s@]+@[^\s@]+\.[^\s@]+$/} onHandleError={handleEmailError} errorMessage={"Please enter a valid email address"} reset={reset}></FormTextField>
                            </AuthFormControl>
                            <AuthFormControl width="100%">
                                <Box sx={{display:"flex", flexDirection:"column", justifyContent:"center"}}>
                                    <LockRounded fontSize="large"></LockRounded>
                                    <br></br>
                                    <br></br>
                                </Box>
                                <FormTextField required type="password" label="Password" name="password" isFocused={false} width="100%" variant="light" onHandleError={()=>{}} errorMessage={"Please enter a valid password"} reset={reset}></FormTextField>
                            </AuthFormControl>
                            <AppButton text={"Sign in"} type="submit" width="100%" handlerFunction={()=>{}}>
                            </AppButton>
                            <AppButton text={"Sign in with Google"} type="button" width="100%" handlerFunction={()=>{handleGoogleAuthUrl()}}>
                                <Google></Google>
                            </AppButton>
                        </div>
                    </Box>
                </Paper>  
            </Container>
        </>
    )
}

export default Login;

Login.propTypes = {
};
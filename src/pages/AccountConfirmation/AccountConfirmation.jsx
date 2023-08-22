import { Box, Container, Paper, Typography } from '@mui/material';
import React, {useState} from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from "./AccountConfirmation.module.css";
import AuthFormControl from "../../components/FormControl/AuthFormControl";
import FormTextField from "../../components/TextField/FormTextField";
import AppButton from "../../components/Button/AppButton";
import { LockRounded } from '@mui/icons-material';
import axios from "../../api/axios";

const AccountConfirmation = () => {
    /*
        ==========================
        =     AUX VARIABLES      =
        ==========================
    */
    const [searchParams] = useSearchParams();
    const confirmationCode = searchParams.get("code");
    /*
        ==========================
        =        HOOKS           =
        ==========================
    */
    const navigate = useNavigate();
    /*
        ==========================
        =         STATES         =
        ==========================
    */ 
    const [reset, setReset] = useState(false);
    const [formError, setFormError] = useState({
        passwordError: {
            error: false,
            errorMessage: "Please enter a valid password address."
        }
    });

    /*
        ==========================
        =        HANDLERS        =
        ==========================
    */

    const handlePasswordSubmit = async (event) => {
        event.preventDefault();
        const body = {
            password: event.target.password.value,
            confirmationCode: confirmationCode
        };
        const errors = Object.values(formError);
        try{
            if(!errors.some((error)=>error.error===true)){
                const response = await axios.post("auth/confirmation", 
                    body,
                    {
                        withCredentials: true,
                        header: {
                            "Content-Type": "application/json",
                        }
                    }
                );
                console.log(response);
                navigate("/login", {replace:true});
            }
            else{
                console.error("There is an error preventing form submission");
            }
        }
        catch(error){
            console.error(error);
        }
        
    }

    const handlePasswordError = (inputError) => {
        setFormError(prevState => ({
            ...prevState,
            passwordError: {
                ...prevState.passwordError,
                error: inputError,
            }
        }));
    }

    return (
        <>
            <Container maxWidth="md">
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
                    <img className={styles.loginPicture} alt="Picture for log in form" src="./images/password-photo.png" />
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
                        onSubmit={handlePasswordSubmit}
                    >
                        <div className={styles.formContainer}>
                            <Typography sx={{textAlign:"center", marginTop:"0px", marginBottom:"5px"}}>Set up your password: </Typography>
                            <AuthFormControl width="100%">
                                <Box sx={{display:"flex", flexDirection:"column", justifyContent:"center"}}>
                                    <LockRounded fontSize="large"></LockRounded>
                                    <br></br>
                                </Box>
                                <FormTextField required type="password" label="Password" name="password" isFocused={false} width="100%" variant="light" regex={/(?=.*[0-9])(?=.{6,})/} errorMessage={"Must be 6 char long and contain at least one number"} onHandleError={handlePasswordError} reset={reset}></FormTextField>
                            </AuthFormControl>
                            <AppButton text={"Set up password"} type="submit" width="50%" handlerFunction={()=>{}}/>
                        </div>             
                    </Box>
                </Paper>
            </Container>            
        </>
    );
};

export default AccountConfirmation
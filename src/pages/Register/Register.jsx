/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Slide, Typography } from '@mui/material';
import { BadgeRounded, Close, Email, LockRounded } from '@mui/icons-material';
import PropTypes from "prop-types";
import axios from "../../api/axios";
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React, { forwardRef, useState } from 'react';
/*
    ==========================
    =       COMPONENTS       =
    ==========================
*/
import AppButton from '../../components/Button/AppButton';
import FormTextField from '../../components/TextField/FormTextField';
import AuthFormControl from '../../components/FormControl/AuthFormControl';

/*
    ==========================
    =          HOOKS         =
    ==========================
*/
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Register = ({openDialog, onCloseRegisterDialog}) => {
    /*
        ==========================
        =         STATES         =
        ==========================
    */
    const [reset, setReset] = useState(false);
    /*
        ==========================
        =        HANDLERS        =
        ==========================
    */
   const handleRegister = async(event) => {
        event.preventDefault();
        const userRegistered = {
            name: event.target["full-name"].value,
            email: (event.target["email-password"].value.trim()).toLowerCase(),
            password: event.target["register-password"].value
        }
        try {
            const response = await axios.post(`${process.env.REACT_APP_AUTH}/${process.env.REACT_APP_AUTH_REGISTER}`,
                JSON.stringify(userRegistered),
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            );
            if(response.data){
                //Send toast notification with success
                console.log(response.data);
                console.log(response.data.token);
                setReset(true);
            }
          } catch (error) {
            //Send toast notification with error message
            console.error(error.response.data);
          }
        onCloseRegisterDialog(false);
   };

    return (
        <Dialog open={openDialog} TransitionComponent={Transition} onClose={onCloseRegisterDialog} fullWidth maxWidth="xs">
            <DialogTitle display={"flex"} justifyContent={"space-between"} alignItems={"center"} gap={"5px"} component={"div"}> 
                <Typography variant="h2" textAlign={"center"} >Create a new account</Typography>
                <AppButton text={""} type="button" width='10%' handlerFunction={()=>{onCloseRegisterDialog()}}>
                    <Close></Close>
                </AppButton>
            </DialogTitle>
            <Box
                component={"form"}
                sx={{
                    display:"flex",
                    flexDirection:"column",
                    justifyContent:"center",
                    alignItems:"center",
                    width:"100%",
                    color: "#C84B31"
                }}
                autoComplete="off"
                onSubmit={handleRegister}
            >
                <DialogContent dividers >
                        <AuthFormControl>
                            <BadgeRounded fontSize={"large"}></BadgeRounded>
                            <FormTextField required type="text" label="Full name: " name="full-name" isFocused={true} width="100%" variant="dark" reset={reset}></FormTextField>
                        </AuthFormControl>
                        <AuthFormControl>
                            <Email fontSize={"large"}></Email>
                            <FormTextField required type="text" label="E-mail: " name="email-password" isFocused={false} width="100%" variant="dark" reset={reset}></FormTextField>
                        </AuthFormControl>
                        <AuthFormControl>
                            <LockRounded fontSize="large"></LockRounded>
                            <FormTextField required type="password" label="Password:" name="register-password" isFocused={false} width="100%" variant="dark" reset={reset}></FormTextField>
                        </AuthFormControl>
                        <AuthFormControl>
                            <LockRounded fontSize="large"></LockRounded>
                            <FormTextField required type="password" label="Confirm password:" name="register-confirm-password" isFocused={false} width="100%" variant="dark" reset={false}></FormTextField>
                        </AuthFormControl>
                </DialogContent>
                <DialogActions sx={{display:"flex", justifyContent:"center"}}>
                        <AppButton text={"Create an account"} type="submit" width='100%' handlerFunction={()=>{}} />
                </DialogActions>    
            </Box>
        </Dialog>
    );
}

export default Register;

Register.propTypes = {
    openDialog: PropTypes.bool.isRequired, 
    onCloseRegisterDialog: PropTypes.func.isRequired, 
}
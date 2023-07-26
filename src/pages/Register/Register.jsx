/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Slide, Typography } from '@mui/material';
import { AccessTime, BadgeRounded, Close, Email, LockRounded } from '@mui/icons-material';
import PropTypes from "prop-types";
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
import FormSelect from '../../components/Select/FormSelect';

/*
    ==========================
    =          HOOKS         =
    ==========================
*/
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Register = ({openDialog, onCloseRegisterDialog, onRegister}) => {
    /*
        ==========================
        =         STATES         =
        ==========================
    */
const [selectValue, setSelectValue] = useState("");

    /*
        ==========================
        =        HANDLERS        =
        ==========================
    */
   const handleSelectValue = (newSelectValue) => {
    setSelectValue(newSelectValue);
   };

   const handleRegister = (event) => {
        event.preventDefault();
        const userRegistered = {
            name: event.target["full-name"].value,
            email: event.target.email.value,
            password: event.target.password.value
        }
        onRegister(userRegistered);
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
                        <FormControl sx={{display:"flex", flexDirection:"row",alignItems:"center", gap:"10px", padding: "5px"}}>
                            <BadgeRounded fontSize={"large"}></BadgeRounded>
                            <FormTextField required type="text" label="Full name: " name="full-name" isFocused={true} width="100%" variant="dark"></FormTextField>
                        </FormControl>
                        <FormControl sx={{display:"flex", flexDirection:"row",alignItems:"center", gap:"10px", padding: "5px"}}>
                            <Email fontSize={"large"}></Email>
                            <FormTextField required type="text" label="E-mail: " name="email" isFocused={false} width="100%" variant="dark"></FormTextField>
                        </FormControl>
                        <FormControl sx={{display:"flex", flexDirection:"row",alignItems:"center", gap:"10px", padding: "5px"}}>
                            <LockRounded fontSize="large"></LockRounded>
                            <FormTextField required type="password" label="Password" name="password" isFocused={false} width="100%" variant="dark"></FormTextField>
                        </FormControl>
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
    onRegister: PropTypes.func.isRequired
}
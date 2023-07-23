/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { Box, Container, Divider, FormControl, Paper, Typography } from '@mui/material'
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React from 'react'
/*
    ==========================
    =         STYLES         =
    ==========================
*/
import styles from './Login.module.css'
import FormTextField from '../../components/TextField/FormTextField'
import { AccountCircleRounded, Google, LockRounded, PasswordRounded } from '@mui/icons-material'
import AppButton from '../../components/Button/AppButton'

const Login = () => {
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
            }>
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
            >
                <div className={styles.formContainer}>
                    <Typography sx={{textAlign:"center", marginTop:"0px", marginBottom:"5px"}}>Sign in to MentorUp</Typography>
                    <FormControl sx={{display:"flex", flexDirection:"row",alignItems:"center", padding: "5px"}}>
                        <AccountCircleRounded fontSize="large"></AccountCircleRounded>
                        <FormTextField required type="text" label="Email"></FormTextField>
                    </FormControl>
                    <FormControl sx={{display:"flex", flexDirection:"row",alignItems:"center", padding: "5px"}}>
                        <LockRounded fontSize="large"></LockRounded>
                        <FormTextField required type="password" label="Password"></FormTextField>
                    </FormControl>
                    <AppButton text={"Sign in"} type="submit" handlerFunction={()=>{}}>
                    </AppButton>
                    <AppButton text={"Sign in with Google"} type="submit" handlerFunction={()=>{}}>
                        <Google></Google>
                    </AppButton>
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
                        <Typography sx={{textAlign:"center", marginTop:"15px", marginBottom:"15px"}}>Don't have an account?</Typography>
                    </Divider>    
                    <AppButton text={"Register"} type="button" handlerFunction={()=>{}}>
                    </AppButton> 
                </div>
            </Box>
            
        </Paper>  
    </Container>
    </>

  )
}

export default Login
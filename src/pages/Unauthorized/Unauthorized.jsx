/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { Box, Container, Divider, Paper, Typography } from '@mui/material';
import { Lock } from '@mui/icons-material';
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React from 'react'
import { useNavigate } from 'react-router-dom';
/*
    ==========================
    =       COMPONENTS       =
    ==========================
*/
import AppButton from '../../components/Button/AppButton';
/*
    ==========================
    =         STYLES         =
    ==========================
*/
import styles from "./Unauthorized.module.css";

const Unauthorized = () => {
    /*
        ==========================
        =         HOOKS          =
        ==========================
    */
    const navigate = useNavigate();
    /*
        ==========================
        =        HANDLERS        =
        ==========================
    */
    const goBack = () => {
        navigate(-1);
    }

    return (
        <div>
            <Container maxWidth="sm" >
                <Paper 
                    elevation={3} 
                    sx={
                        {
                            display:"flex", 
                            flexDirection:"column", 
                            justifyContent:"center", 
                            alignItems:"center", 
                            gap: 2,
                            bgcolor:"#1A1A2E", 
                            color: "#FFFFFF", 
                            borderRadius: "40px",
                            padding:2,
                            height:"auto",
                        }
                    }
                >
                    <Box
                        sx={{

                            display: "flex",
                            flexDirection: "column",
                            justifyContent:"center",
                            alignItems:"center",
                            width: "100%"
                        }}
                    >
                        <div className={styles.formContainer}>
                            <Lock sx={{fontSize: 100}}></Lock>
                            <Typography sx={{textAlign:"center", marginTop:"0px", marginBottom:"5px"}}>Sorry! You are not authorized to access this page.</Typography>
                        </div>
                    </Box>
                    <Divider 
                        flexItem 
                        sx={
                            {
                                    borderColor: "white",
                                    borderWidth: '1px'
                            }
                        }
                    />
                    <div className={styles.formContainer}>
                        <AppButton text={"Go back"} type="button" width="100%" handlerFunction={()=>{goBack()}}>            
                        </AppButton>
                    </div>
                </Paper>  
            </Container>
        </div>
    )
}

export default Unauthorized;
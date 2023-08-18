/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Slide, Typography } from '@mui/material';
import { AdminPanelSettingsRounded, BadgeRounded, Close, Email } from '@mui/icons-material';
import useAxiosPrivate from '../../../../../hooks/useAxiosPrivate';

/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React, { useState, forwardRef, useEffect } from 'react';
/*
    ==========================
    =        STYLES          =
    ==========================
*/
import styles from "../RegisterOnCohort.module.css";
/*
    ==========================
    =        COMPONENTS      =
    ==========================
*/
import AppButton from '../../../../../components/Button/AppButton';
import FormTextField from '../../../../../components/TextField/FormTextField';
import AuthFormControl from '../../../../../components/FormControl/AuthFormControl';
import FormSelect from '../../../../../components/Select/FormSelect';
/*
    ==========================
    =          HOOKS         =
    ==========================
*/
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
/*
    ==========================
    =     AUX VARIABLES      =
    ==========================
*/
const rolesList = ["Admin", "Mentor", "Student"];

const EditCohortUser = ({openDialog, cohortData, cohortUserInfo, onCloseDialog, onHandleCohortUsers}) => {
    /*
        ==========================
        =          HOOKS         =
        ==========================
    */
    const axiosPrivate = useAxiosPrivate();
    /*
        ==========================
        =         STATES         =
        ==========================
    */
    //Form states
    const [userName, setUserName] = useState(cohortUserInfo.row.userName);
    const [userEmail, setUserEmail] = useState(cohortUserInfo.row.userEmail);
    const [userRoles, setUserRoles] = useState(cohortUserInfo.row.userRole.map((role)=>(role[0].toUpperCase()+role.slice(1))));
    const [formError, setFormError] = useState({
        userNameError: {
            error:false,
            errorMessage: "Please enter a valid name"
        },
        userEmailError: {
            error:false,
            errorMessage: "Please enter a valid e-mail address"
        },
        userRolesError: {
            error: false,
            errorMessage: "Please select a role for this user"
        },
    });
    const [reset, setReset] = useState(false);

    /* 
        ==========================
        =        EFFECTS         =
        ==========================
    */
    useEffect(()=>{
        setFormError((prevState) => ({
                ...prevState,
                userRolesError: {
                    ...prevState.userRolesError,
                    error: userRoles.length === 0 ? true:false
                }
            }) 
        );
    }, [userRoles]);

    useEffect(()=>{
        setReset(false);
    });

    /*
        ==========================
        =   HANDLER FUNCTIONS    =
        ==========================
    */
    // onSelect Role:
    const handleOnSelectRole = (selectedRoleName) => {
        setUserRoles(selectedRoleName);
    }

    // User name:
    const handleUserNameError = (inputError) => {
        setFormError((prevState) => ({
                ...prevState,
                userNameError: {
                    ...prevState.userNameError,
                    error: inputError
                }
            })
        );
    }

    //User email
    const handleUserEmailError = (inputError) => {
        setFormError((prevState) => ({
                ...prevState,
                userEmailError: {
                    ...prevState.userEmailError,
                    error: inputError
                }
            })
        );
    };

    //Edit user submit:
    const handleEditCohortUserSubmit = (event) => {
        event.preventDefault();
        const cohortUserToBeUpdated = {
            id: cohortUserInfo.row.id,
            userName: event.target.userName.value.trim(),
            userEmail: event.target.userEmail.value.trim(),
            userRole: userRoles
        };        
        const errors = Object.values(formError);
        try{
            if(!errors.some((error)=>error.error===true)){
                onHandleCohortUsers((prevCohortUsers) => 
                    prevCohortUsers.map((prevCohortUser)=>{
                        if (prevCohortUser.id === cohortUserToBeUpdated.id){
                            return (
                                {
                                    ...prevCohortUser,
                                    userName: cohortUserToBeUpdated.userName,
                                    userEmail: cohortUserToBeUpdated.userEmail,
                                    userRole: cohortUserToBeUpdated.userRole.map((role)=>role.toLowerCase()),
                                }
                            );
                        }
                        else{
                            return prevCohortUser;
                        }
                    })
                );
                setReset(true);
                setUserRoles([]);
                onCloseDialog();
            }
            else{
                console.error("There is an error preventing the form submission: check that your entires are correctly validated");
            }
        }
        catch(error){
            console.error(error);
        }
    };

    return (
        <Dialog open={openDialog} TransitionComponent={Transition} onClose={onCloseDialog} fullWidth maxWidth="sm">
            <DialogTitle display={"flex"} justifyContent={"space-between"} alignItems={"center"} gap={"5px"} component={"div"}> 
                <Typography variant="h1" textAlign={"center"} fontSize={"30px"} fontWeight={"bold"}>Edit user: </Typography>
                <AppButton text={""} type="button" width='10%' handlerFunction={()=>{onCloseDialog()}}>
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
                onSubmit={handleEditCohortUserSubmit}
            >
                <DialogContent sx={{width:"100%", paddingX:0, paddingY:1}} dividers>
                    <div className={styles.formContainer}>
                        <AuthFormControl width="75%">
                            <Box sx={{display:"flex", flexDirection:"column", justifyContent:"center"}}>
                                <BadgeRounded fontSize="large"></BadgeRounded>
                                <br></br>
                            </Box>
                            <FormTextField required value={userName} type="text" label="Full name:" name="userName" isFocused={true} width="100%" variant="dark" regex={/^[a-zA-z]+([\s][a-zA-Z]+)*$/} onHandleError={handleUserNameError} errorMessage={"Please enter a valid name"} reset={reset}></FormTextField>
                        </AuthFormControl>
                        <AuthFormControl width="75%">
                            <Box sx={{display:"flex", flexDirection:"column", justifyContent:"center"}}>
                                <Email fontSize="large"></Email>
                                <br></br>
                            </Box>
                            <FormTextField required value={userEmail} type="text" label="E-mail:" name="userEmail" isFocused={false} width="100%" variant="dark" regex={/^[^\s@]+@[^\s@]+\.[^\s@]+$/} onHandleError={handleUserEmailError} errorMessage={"Please enter a valid e-mail address"} reset={reset}></FormTextField>
                        </AuthFormControl>
                        <AuthFormControl width="75%">
                            <Box sx={{display:"flex", flexDirection:"column", justifyContent:"center"}}>
                                <AdminPanelSettingsRounded fontSize="large"/>
                                <br></br>
                            </Box>
                            <AuthFormControl width="100%" isNested={true} error={formError.userRolesError.error}>
                                <FormSelect id={"userRoles"} name={"userRoles"} label={"Roles:"} selectValue={userRoles} onSelectValue={handleOnSelectRole} list={rolesList} variant={"dark"} multiple={true} error={formError.userRolesError}></FormSelect>
                            </AuthFormControl>
                        </AuthFormControl>
                    </div>
                </DialogContent>
                <DialogActions sx={{display:"flex", justifyContent:"center"}}>
                    <AppButton text={"Edit user"} type="submit" width="100%" handlerFunction={()=>{}}/>
                </DialogActions>    
            </Box>
        </Dialog>
    )
};

export default EditCohortUser;
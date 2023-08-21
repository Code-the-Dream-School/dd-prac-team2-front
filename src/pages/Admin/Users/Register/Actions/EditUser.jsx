import { AdminPanelSettingsRounded, Close, School } from '@mui/icons-material';
import { Dialog, DialogActions, DialogContent, DialogTitle, Slide, Typography } from '@mui/material';
import React, { forwardRef, useEffect, useState } from 'react'
import AppButton from '../../../../../components/Button/AppButton';
import { Box } from '@mui/system';
import AuthFormControl from '../../../../../components/FormControl/AuthFormControl';
import FormAutocomplete from '../../../../../components/Autocomplete/Autocomplete';
import styles from "../RegisterUsers.module.css";
import FormSelect from '../../../../../components/Select/FormSelect';

/*
    ==========================
    =          HOOKS         =
    ==========================
*/
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const rolesList = ["Admin", "Mentor", "Student"];


const EditUser = ({openDialog, userInfo, fetchedCohorts, onCloseDialog, onHandleUsers}) => {
    const [cohorts, setCohorts] = useState(fetchedCohorts);
    const [userRoles, setUserRoles] = useState(userInfo.row.userRole.map((role)=>(role[0].toUpperCase()+role.slice(1))));
    const [cohortsValueSelected, setCohortsValueSelected] = useState(userInfo.row.userCohort);
    const [cohortsInputValueSelected, setCohortsInputValueSelected] = useState("");
    const [formError, setFormError] = useState({
        userCohortError: {
            error:false,
            errorMessage: "Please add a cohort for this user"
        },        
        userRolesError: {
            error: true,
            errorMessage: "Please select a role for this user"
        },
    });

    //User cohorts
    const handleValueSelectedChange = (newValue) => {
        setCohortsValueSelected(newValue);
    }
     // onSelect Role:
     const handleOnSelectRole = (selectedRoleName) => {
        setUserRoles(selectedRoleName);
    }

    //Edit dialog onSubmit:
    const handleEditUserSubmit = (event) => {
        event.preventDefault();
        const userToBeUpdated = userInfo.row.id;
        const formattedUpdatedUser = {
            id: userToBeUpdated,
            userCohort: cohortsValueSelected,
            userRole: userRoles
        };
        const errors = Object.values(formError);
        try{
            if(!errors.some((error)=>error.error===true)){
                onHandleUsers((prevUsers) => 
                    prevUsers.map((user)=>{
                    if (user.id===userToBeUpdated){
                        return (
                            {
                                ...user,
                                userCohort: formattedUpdatedUser.userCohort,
                                userRole: formattedUpdatedUser.userRole
                            }
                        );
                    }
                    else{
                        return user;
                    }
                    })
                );
                onCloseDialog();
            }
            else{
                console.error("There are some errors preventing the form to be submitted");
            }
        }
        catch(error){
            console.error(error);
        }
        
    }

    useEffect(()=>{
        setFormError((prevState)=>
        (
            {
                ...prevState,
                userCohortError:{
                    ...prevState.userCohortError,
                    error: cohortsValueSelected.length === 0 ? true:false
                }
            }
        ));
    }, [cohortsValueSelected]);

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
                onSubmit={handleEditUserSubmit}
            >
                <DialogContent sx={{width:"100%", paddingX:0, paddingY:1}} dividers>
                    <div className={styles.formContainer}>
                        <AuthFormControl width="75%">
                            <Box sx={{display:"flex", flexDirection:"column", justifyContent:"center"}}>
                                <School fontSize="large"/>
                                <br></br>
                            </Box>
                            <AuthFormControl width="100%" isNested={true}>
                                <FormAutocomplete multiple={true} value={cohortsValueSelected} onHandleSelectedValueChange={handleValueSelectedChange} inputValue={cohortsInputValueSelected} onHandleInputValueChange={setCohortsInputValueSelected} options={cohorts} error={formError.userCohortError} variant={"dark"}></FormAutocomplete>
                            </AuthFormControl>
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
}

export default EditUser
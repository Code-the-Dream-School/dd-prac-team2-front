/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { Container } from '@mui/material';
import { DeleteRounded, EditRounded } from '@mui/icons-material';
import PropTypes from "prop-types";
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React,{ useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
/*
    ==========================
    =          HOOKS         =
    ==========================
*/
import useAuth from '../../../../../hooks/useAuth';
/*
    ==========================
    =        COMPONENTS      =
    ==========================
*/
import AppButton from '../../../../../components/Button/AppButton';
import useAxiosPrivate from '../../../../../hooks/useAxiosPrivate';
import EditCohortUser from './EditCohortUser';

const RegisterOnCohortActions = ({params, onHandleCohortUsers}) => {
    /*
        ==========================
        =          HOOKS         =
        ==========================
    */
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const {setAuth} = useAuth();
    /*
        ==========================
        =         STATES         =
        ==========================
    */
    const [openEditDialog, setOpenEditDialog] = useState(false);

    /*
        ==========================
        =    HANDLER FUNCTIONS   =
        ==========================
    */
    const handleDeleteCohortUser = () => {
        const cohortUserId = params.row.id;
        try{
            onHandleCohortUsers((prevCohortUsers)=>{
                return (prevCohortUsers.filter((user)=>user.id!==cohortUserId));
            });
        }
        catch(error){
            if(error.response.status === 403){
                console.error(error);
                //User is required to validate auth again
                navigate("/login", {state:{from: location}, replace: true});
                setAuth({
                    userId: "",
                    userName: "",
                    userEmail: "",
                    role: [],
                    loggedIn: false,
                    avatarUrl: "",
                    isActive: undefined,
                    accessToken: ""
                });
            }
            else{
                console.error(error);
            }            
        }
    };

    const handleOpenEditCohortUserDialog = () => {
        setOpenEditDialog(true);
    }

    const handleCloseEditCohortUserDialog = () => {
        setOpenEditDialog(false);
    }

    return (
        <>
            <Container sx={{display:"flex", flexDirection:"row", gap:"5px", "&":{paddingLeft:0, paddingRight:0}, paddingLeft:0}}>
                <AppButton text={"Edit"} type="button" width="auto" color="#F3950D" handlerFunction={handleOpenEditCohortUserDialog}>
                    <EditRounded></EditRounded>
                </AppButton>
                <AppButton text={"Delete"} type="button" width="auto" color="#CD1818"  handlerFunction={handleDeleteCohortUser}>
                    <DeleteRounded></DeleteRounded>
                </AppButton>                
            </Container>
            {
                openEditDialog ?
                (<EditCohortUser openDialog={openEditDialog} cohortUserInfo={params} onCloseDialog={handleCloseEditCohortUserDialog} onHandleCohortUsers={onHandleCohortUsers}></EditCohortUser>) :
                (null)
            }
        </>
    );
};

export default RegisterOnCohortActions;

RegisterOnCohortActions.propTypes = {
    params: PropTypes.object.isRequired,
    onHandleCohortUsers: PropTypes.func.isRequired,
};
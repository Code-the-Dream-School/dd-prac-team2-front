/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { Container } from '@mui/material';
import { DeleteRounded, EditRounded } from '@mui/icons-material';
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React,{ useState } from 'react';
/*
    ==========================
    =        COMPONENTS      =
    ==========================
*/
import AppButton from '../../../../../components/Button/AppButton';
import useAxiosPrivate from '../../../../../hooks/useAxiosPrivate';
import EditCohortUser from './EditCohortUser';

const RegisterOnCohortActions = ({params, cohortData, onHandleCohortUsers}) => {
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
    const [openEditDialog, setOpenEditDialog] = useState(false);

    const handleDeleteCohortUser = () => {
        const cohortUserId = params.row.id;
        onHandleCohortUsers((prevCohortUsers)=>{
            return (prevCohortUsers.filter((user)=>user.id!==cohortUserId));
        })
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
                (<EditCohortUser openDialog={openEditDialog} cohortData={cohortData} cohortUserInfo={params} onCloseDialog={handleCloseEditCohortUserDialog} onHandleCohortUsers={onHandleCohortUsers}></EditCohortUser>) :
                (null)
            }
        </>
    );
};

export default RegisterOnCohortActions;
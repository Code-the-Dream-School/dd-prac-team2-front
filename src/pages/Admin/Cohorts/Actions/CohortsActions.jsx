/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import AppButton from '../../../../components/Button/AppButton';
import { Container } from '@mui/material';
import { ChecklistRounded, DeleteRounded, EditRounded, PeopleAltRounded } from '@mui/icons-material';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React, { useState } from 'react';
/*
    ==========================
    =       COMPONENTS       =
    ==========================
*/
import EditCohort from './EditCohort';
import { Link } from 'react-router-dom';

const CohortsActions = ({params, onHandleCohorts}) => {
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
    /*
        ==========================
        =         HANDLERS       =
        ==========================
    */
    const handleDeleteCohort = async() => {
        try{
            const response = await axiosPrivate.delete(`/cohort/${params.row.id}`,
                {
                    withCredentials: true
                }
            );
            if(response.status===200){
                onHandleCohorts((prevCohorts) => {
                    return(
                        prevCohorts.filter((cohort)=>cohort.id!==params.row.id)
                    );
                })
            }
        }
        catch(error){
            console.error(error);
        }
    }

    const handleOpenEditCohort = () => {
        setOpenEditDialog(true);
    };

    const handleCloseEditCohort = () => {
        setOpenEditDialog(false);
    };

    return (
        <>
            <Container sx={{display:"flex", flexDirection:"row", gap:"5px", "&":{paddingLeft:0, paddingRight:0}, paddingLeft:0}}>
                <Link to={`${params.row.id}`}>
                    <AppButton text={"Lessons"} type="button" width="auto" color="#609966" handlerFunction={()=>{}}>
                        <ChecklistRounded></ChecklistRounded>
                    </AppButton>
                </Link>
                <Link to={`register/${params.row.id}`}>
                    <AppButton text={"Users"} type="button" width="auto" color="#609966" handlerFunction={()=>{}}>
                        <PeopleAltRounded></PeopleAltRounded>
                    </AppButton>
                </Link>
                <AppButton text={"Edit"} type="button" width="auto" color="#F3950D" handlerFunction={()=>{handleOpenEditCohort()}}>
                    <EditRounded></EditRounded>
                </AppButton>
                <AppButton text={"Delete"} type="button" width="auto" color="#CD1818"  handlerFunction={()=>handleDeleteCohort()}>
                    <DeleteRounded></DeleteRounded>
                </AppButton>
            </Container>
            {
                openEditDialog ? 
                (<EditCohort openDialog={openEditDialog} cohortInfo={params} onCloseDialog={handleCloseEditCohort} onHandleCohorts={onHandleCohorts}/>)
                : null
            }
        </>
    )
}

export default CohortsActions;
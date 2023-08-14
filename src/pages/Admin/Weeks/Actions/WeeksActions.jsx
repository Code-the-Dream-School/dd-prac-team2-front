/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { Container } from '@mui/material'
import AppButton from '../../../../components/Button/AppButton'
import { DeleteRounded, EditRounded } from '@mui/icons-material'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React, { useState } from 'react'
import EditCohortWeek from './EditCohortWeek'
/*
    ==========================
    =       COMPONENTS       =
    ==========================
*/

const WeeksActions = ({params, cohortData, onHandleCohortWeeks}) => {
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
   const [openEditDialog, setOpenEditDialog] = useState();

    const handleDeleteCohortWeek = async() =>{
        const weekId = params.row.id;
        try{
            const response = await axiosPrivate.delete(`/week/${weekId}`);
            if(response.status === 200) {
                onHandleCohortWeeks(
                    (prevCohortWeeks) => prevCohortWeeks.filter((week) => {
                        if(week.id!==weekId){
                            return week;
                        }
                    })
                );
            }
        }
        catch(error){
            console.error(error);
        }
    }

    const handleOpenEditCohortWeek = () => {
        setOpenEditDialog(true);
    };

    const handleCloseEditCohortWeek = () => {
        setOpenEditDialog(false);
    };
    
    return (
        <>
            <Container sx={{display:"flex", flexDirection:"row", gap:"5px", "&":{paddingLeft:0, paddingRight:0}, paddingLeft:0}}>
                <AppButton text={"Edit"} type="button" width="auto" color="#F3950D" handlerFunction={handleOpenEditCohortWeek}>
                    <EditRounded></EditRounded>
                </AppButton>
                <AppButton text={"Delete"} type="button" width="auto" color="#CD1818"  handlerFunction={handleDeleteCohortWeek}>
                    <DeleteRounded></DeleteRounded>
                </AppButton>                
            </Container>
            {
                openEditDialog ?
                (<EditCohortWeek openDialog={openEditDialog} cohortData={cohortData} weekInfo={params} onCloseDialog={handleCloseEditCohortWeek} onHandleCohortWeeks={onHandleCohortWeeks}></EditCohortWeek>) :
                (null)
            }
        </>
    )
}

export default WeeksActions

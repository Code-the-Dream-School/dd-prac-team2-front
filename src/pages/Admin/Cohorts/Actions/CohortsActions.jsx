import React from 'react';
import AppButton from '../../../../components/Button/AppButton';
import { Container } from '@mui/material';
import { ChecklistRounded, DeleteRounded, EditRounded } from '@mui/icons-material';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';

const CohortsActions = ({params, onHandleCohorts}) => {
    /*
        ==========================
        =          HOOKS         =
        ==========================
    */
   const axiosPrivate = useAxiosPrivate();
    /*
        ==========================
        =         HANDLERS       =
        ==========================
    */
    const handleDeleteCohort = async() => {
        console.log("I WILL DELETE:",params.row.id);
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

    return (
        <Container sx={{display:"flex", flexDirection:"row", gap:"5px", "&":{paddingLeft:0, paddingRight:0}, paddingLeft:0}}>
            <AppButton text={"Edit"} type="button" width="auto" color="#F3950D" handlerFunction={()=>{}}>
                <EditRounded></EditRounded>
            </AppButton>
            <AppButton text={"Lessons"} type="button" width="auto" color="#609966" handlerFunction={()=>{}}>
                <ChecklistRounded></ChecklistRounded>
            </AppButton>
            <AppButton text={"Delete"} type="button" width="auto" color="#CD1818"  handlerFunction={()=>handleDeleteCohort()}>
                <DeleteRounded></DeleteRounded>
            </AppButton>
        </Container>
    )
}

export default CohortsActions;
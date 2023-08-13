/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { useParams } from 'react-router-dom';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React, { useState, useEffect } from 'react';
/*
    ==========================
    =        STYLES          =
    ==========================
*/
import styles from "./Weeks.module.css";
import AppDataGrid from '../../../components/DataGrid/AppDataGrid';
import { Container, Paper, Typography } from '@mui/material';
/*
    ==========================
    =        COMPONENTS      =
    ==========================
*/


const Weeks = () => {
    /*
        ==========================
        =          HOOKS         =
        ==========================
    */
    const {cohortId} = useParams()
    const axiosPrivate = useAxiosPrivate();

    /*
        ==========================
        =         STATES         =
        ==========================
    */
    const [cohortName, setCohortName] = useState("");
    const [cohortWeeks, setCohortWeeks] = useState([]);

    /*
        ==========================
        =      AUX VARIABLES     =
        ==========================
    */
    const columns = [
        {field: "id", headerName: "ID", maxWidth: 130, flex: 1},
        {field: "weekName", headerName: "Week", maxWidth: 400, flex: 1},
        {field: "weekStartDate", headerName: "Start date", type: "date", maxWidth: 150, flex: 1},
        {field: "weekEndDate", headerName: "End date", type: "date", maxWidth: 150, flex: 1},
    ];
    /*
        ==========================
        =    ASYNC FUNCTIONS     =
        ==========================
    */
    const fetchCohortWeeks = async ()=>{
        const response = await axiosPrivate.get(`/cohort/${cohortId}`);
        const formattedWeeks = (response.data.cohort[0].weeks).map((week)=>{
            return({
                id: week._id,
                weekName: week.name,
                weekStartDate: new Date(week.start),
                weekEndDate: new Date(week.end)
            });
        });
        setCohortName(response.data.cohort[0].name);
        setCohortWeeks(formattedWeeks);
    }

    /*
        ==========================
        =         EFFECTS        =
        ==========================
    */
    useEffect(()=>{
        fetchCohortWeeks();
    }, []);

    return (
        <Container maxWidth="md">
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
                            borderRadius: "10px",
                            padding:2,
                            height:"auto",
                        }
                    }
            >
                <Typography component={"h1"} sx={{backgroundColor:"#C84B31", borderRadius:2, padding: 1, margin: 1, textAlign: "center", textTransform:"uppercase", fontWeight:"bold", fontSize: 25}} > {cohortName}'S weeks management </Typography>
                <AppDataGrid columns={columns} rows={cohortWeeks} pageSize={9}/>
            </Paper>
        </Container>
    );
}

export default Weeks;
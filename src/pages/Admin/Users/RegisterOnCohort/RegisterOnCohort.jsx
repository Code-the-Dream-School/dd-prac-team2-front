/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { useNavigate, useParams } from 'react-router-dom';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import { Container, Paper, Typography } from '@mui/material';

/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
/*
    ==========================
    =        STYLES          =
    ==========================
*/
import styles from "./RegisterOnCohort.module.css";
/*
    ==========================
    =        COMPONENTS      =
    ==========================
*/
import AppDataGrid from '../../../../components/DataGrid/AppDataGrid';
import AppButton from '../../../../components/Button/AppButton';
import UserRoleRender from './TableRenders/UserRoleRender';
import UserStatusRender from './TableRenders/UserStatusRender';
import RegisterOnCohortActions from './Actions/RegisterOnCohortActions';

const RegisterOnCohort = () => {
    /*
        ==========================
        =          HOOKS         =
        ==========================
    */
    const {cohortId} = useParams()
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    /*
        ==========================
        =         STATES         =
        ==========================
    */
    const [cohortUsers, setCohortUsers] = useState([]);
    console.log(cohortUsers);
    const [cohortData, setCohortData] = useState({});

    /*
        ==========================
        =      AUX VARIABLES     =
        ==========================
    */
    const columns = [
        {field: "id", headerName: "ID", minWidth:100, maxWidth: 130, flex: 1},
        {field: "userName", headerName: "Full name:", minWidth:250, maxWidth: 250, flex: 1},
        {field: "userEmail", headerName: "E-mail:", minWidth:200, maxWidth: 300, flex: 1},
        {field: "userRole", headerName: "Roles: ", sortable:false, disableColumnMenu:true,minWidth:250, maxWidth: 250, flex: 1, valueGetter: (params)=>(params), renderCell: (params)=>(<UserRoleRender params={params}></UserRoleRender>)},
        {field: "userActivatedStatus", headerName: "Status: ", sortable:false, disableColumnMenu:true, minWidth:100, maxWidth: 100, flex: 1, valueGetter: (params)=>(params), renderCell: (params)=>(<UserStatusRender params={params}></UserStatusRender>)},
        {field: "actions", headerName: "Actions: ", sortable:false, disableColumnMenu:true, minWidth: 180, flex: 1, valueGetter: (params)=>(params), renderCell: (params)=>(<RegisterOnCohortActions params={params}></RegisterOnCohortActions>)},
    ];
    /*
        ==========================
        =    ASYNC FUNCTIONS     =
        ==========================
    */
    const fetchCohortUsers = async () => {
        try{
            const response = await axiosPrivate(`cohort/${cohortId}`);
            if(response.status===200){
                const participants = response.data.cohort[0].participants;
                const formattedUsers =  participants.map((participant)=>{
                    return ({
                        id: participant,
                        userName: "Saul Ernesto Castillo Chamagua",
                        userEmail: "secch97@gmail.com",
                        userRole: ["Admin"],
                        userActivatedStatus: false
                    });
                });
                const formattedCohortData = {
                    cohortId: cohortId,
                    cohortName: response.data.cohort[0].name
                }
                setCohortUsers(formattedUsers);
                setCohortData(formattedCohortData);
            }
            else{
                console.error("There was an error fetching the users of this cohort");
            }
        }
        catch(error){
            console.error(error);
        }
    }

    /*
        ==========================
        =   HANDLER FUNCTIONS    =
        ==========================
    */
    //. Function to navigate back
    const goBack = () => {
        navigate(-1);
    };

    /*
        ==========================
        =         EFFECTS        =
        ==========================
    */
    useEffect(()=>{
        fetchCohortUsers();
    }, []);

    return (
        <Container maxWidth="lg">
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
                <Typography component={"h1"} sx={{backgroundColor:"#C84B31", borderRadius:2, padding: 1, margin: 1, textAlign: "center", textTransform:"uppercase", fontWeight:"bold", fontSize: 25}} > {cohortData.cohortName}'S users management </Typography>
                <AppDataGrid columns={columns} rows={cohortUsers} pageSize={10} fieldToBeSorted={"userName"} sortType={"asc"}/>
                <div className={styles.buttonContainer}>
                    <AppButton text={"Go back"} type="button" width="100%" handlerFunction={()=>{goBack()}}>            
                    </AppButton>
                </div>
            </Paper>
        </Container>
    )
};

export default RegisterOnCohort;
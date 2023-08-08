/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { Box, Button, Container, Paper, Typography, styled } from '@mui/material';
import { CalendarMonthRounded, LaptopRounded, SchoolRounded } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers';
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React from 'react';
/*
    ==========================
    =        STYLES          =
    ==========================
*/
import styles from "./Cohorts.module.css";
/*
    ==========================
    =        COMPONENTS      =
    ==========================
*/
import AuthFormControl from '../../../components/FormControl/AuthFormControl';
import FormTextField from '../../../components/TextField/FormTextField';
import FormSelect from "../../../components/Select/FormSelect"
import AppButton from '../../../components/Button/AppButton';
import AppDataGrid from '../../../components/DataGrid/AppDataGrid';
import AppDatePicker from '../../../components/DatePicker/AppDatePicker';

const RenderActions = (props) => {
    return(
        <Button
        component="button"
        variant="contained"
        size="small"
        onClick={()=>{alert(props.value.id)}}
        >
            {props.value.id}
        </Button>
    )
}
/*
    ==========================
    =     AUX VARIABLES      =
    ==========================
*/
const columns = [
    {field: "id", headerName: "ID", width: 130},
    {field: "cohort", headerName: "Cohort", width: 130},
    {field: "class", headerName: "Class", width: 130},
    {field: "startDate", headerName: "Start date", type: "date", width: 130},
    {field: "endDate", headerName: "End date", type: "date", width: 130},
    {field: "actions", headerName: "Actions", sortable:false, disableColumnMenu:true, width: 130, valueGetter: (params)=>({id:params.id}), renderCell: RenderActions }
]

const rows = [
    {id: "1", cohort:"Dove", class: "React.js", startDate: new Date(), endDate: new Date()},
    {id: "2", cohort:"Deer", class: "React.js", startDate: new Date(), endDate: new Date()},
    {id: "3", cohort:"Dorado", class: "React.js", startDate: new Date(), endDate: new Date()},
];

const Cohorts = () => {
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
                <Typography component={"h1"} sx={{backgroundColor:"#C84B31", borderRadius:2, padding: 1, margin: 1, textAlign: "center", fontWeight:"bold", fontSize: 25}}> COHORTS MANAGEMENT </Typography>
                <Box
                        component={"form"}
                        sx={{

                            display: "flex",
                            flexDirection: "column",
                            justifyContent:"center",
                            alignItems:"center",
                            width: "100%"
                        }}
                        autoComplete='off'
                        onSubmit={()=>{}}
                >
                    <div className={styles.formContainer}>
                        <AuthFormControl width="75%">
                            <SchoolRounded fontSize="large"></SchoolRounded>
                            <FormTextField required type="text" label="Cohort:" name="cohort" isFocused={true} width="100%" variant="light" regex={/^[^\s@]+@[^\s@]+\.[^\s@]+$/} onHandleError={()=>{}} reset={null}></FormTextField>
                        </AuthFormControl>
                        <AuthFormControl width="75%">
                            <LaptopRounded fontSize="large"/>
                            <AuthFormControl width="100%" isNested={true}>
                                <FormSelect id={"class"} label={"Class:"} selectValue={""} onSelectValue={()=>{}} list={["Intro to programming", "React.js", "Node.js/Express", "Ruby on Rails"]}></FormSelect>
                            </AuthFormControl>
                        </AuthFormControl>
                        <AuthFormControl width="75%">
                            <CalendarMonthRounded fontSize="large"/>
                            <AppDatePicker label={"Start date:"}></AppDatePicker>
                            <AppDatePicker label={"End date:"}></AppDatePicker>
                        </AuthFormControl>
                        <AppButton text={"Add new cohort"} type="submit" width="25%" handlerFunction={()=>{}}/>
                    </div>
                </Box>
                <AppDataGrid columns={columns} rows={rows}/>
            </Paper>
        </Container>
    )
}

export default Cohorts;
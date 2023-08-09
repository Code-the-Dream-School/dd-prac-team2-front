/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { Box, Button, Container, Paper, Typography, styled } from '@mui/material';
import { CalendarMonthRounded, LaptopRounded, SchoolRounded } from '@mui/icons-material';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React, { useEffect, useState } from 'react';
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
import dayjs from 'dayjs';

const RenderActions = (props) => {
    return(
        <>
            <Button
                component="button"
                variant="contained"
                size="small"
                sx={{mx:"2px"}}
            >
                {"EDIT"}
            </Button>
            <Button
                component="button"
                variant="contained"
                size="small"
                sx={{mx:"2px"}}
            >
                {"DELETE"}
            </Button>
            <Button
                component="button"
                variant="contained"
                size="small"
                sx={{mx:"2px"}}
            >
                {"Option"}
            </Button>            
        </>
        
    )
}
/*
    ==========================
    =     AUX VARIABLES      =
    ==========================
*/
const classList = ["Intro to programming", "React.js", "Node.js/Express", "Ruby on Rails"];

const columns = [
    {field: "id", headerName: "ID", width: 130},
    {field: "cohort", headerName: "Cohort", width: 175},
    {field: "class", headerName: "Class", width: 175},
    {field: "startDate", headerName: "Start date", type: "date", width: 100},
    {field: "endDate", headerName: "End date", type: "date", width: 100},
    {field: "actions", headerName: "Actions", sortable:false, disableColumnMenu:true, flex: 1, minWidth: 250, valueGetter: (params)=>(params), renderCell: RenderActions }
]

const rows = [
    {id: "1", cohort:"Dove", class: "React.js", startDate: new Date(), endDate: new Date()},
    {id: "2", cohort:"Deer", class: "React.js", startDate: new Date(), endDate: new Date()},
    {id: "3", cohort:"Dorado", class: "React.js", startDate: new Date(), endDate: new Date()},
];

const Cohorts = () => {
    /*
        ==========================
        =         STATES         =
        ==========================
    */
    const [reset, setReset] = useState(false);
    const [className, setClassName] = useState("");
    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs());
    const [formError, setFormError] = useState({
        cohortError: {
            error: false,
            errorMessage: "Please enter a valid name"
        },
        classNameError: {
            error: true, //Initial value is blank, this is why I set the error to true.
            errorMessage: "Please select a class for this cohort"
        },
        startDateError: {
            error: false,
            errorMessage: "Please select a start date for this cohort"
        },
        endDateError: {
            error: false,
            errorMessage: "Please select an end date for this cohort"
        }
    });
    const [cohorts, setCohorts] = useState([]);
    /*
        ==========================
        =         HOOKS          =
        ==========================
    */
    const axiosPrivate = useAxiosPrivate();
    /*
        ==========================
        =     ASYNC FUNCTIONS    =
        ==========================
    */
    const fetchCohorts = async() => {
        const response = await axiosPrivate.get("/cohort", {
            withCredentials: true,
        });
        const formattedCohorts = (response.data.cohorts).map((cohort)=>{
            return ({
                id: cohort._id,
                cohort: cohort.name,
                class: cohort.type,
                startDate: new Date(cohort.start),
                endDate: new Date(cohort.end)
            });
        });
        console.log(formattedCohorts);
        setCohorts(formattedCohorts);
    }
    /*
        ==========================
        =        EFFECTS         =
        ==========================
    */
    useEffect(()=>{
        fetchCohorts();
    }, []);
    /*
        ==========================
        =         HANDLERS       =
        ==========================
    */
   //1. Cohort errorHandler:
   const handleCohortNameError = (inputError) => {
    setFormError((prevState)=>(
        {
            ...prevState,
            cohortError: {
                ...prevState.cohortError,
                error: inputError
            }
        }
    ));
   }
   //2. Class name handler
    const handleClassNameChange = (selectedClassName) => {
        setClassName(selectedClassName);
        setFormError((prevState)=>(
            {
                ...prevState,
                classNameError: {
                    ...prevState.classNameError,
                    error: false
                }
            }
        ));
    }
    //3. Start date handler
    const handleStartDateChange = (newStartDate) => {
        setStartDate(newStartDate);
        setFormError((prevState)=>(
            {
                ...prevState,
                endDateError: {
                    ...prevState.endDateError,
                    error: endDate < newStartDate ? true:false
                }
            }
        ));
    }
    //4. End date handler
    const handleEndDateChange = (newEndDate) => {
        setEndDate(newEndDate);
        setFormError((prevState)=>(
            {
                ...prevState,
                startDateError: {
                    ...prevState.startDateError,
                    error: newEndDate < startDate ? true:false
                },
                endDateError: {
                    ...prevState.endDateError,
                    error: newEndDate < startDate ? true:false
                }
            }
        ));
    }
    //5. Form onSubmit event handler
    const handleCohortSubmit = (event) => {
        event.preventDefault();
        const newCohort = {
            cohort: event.target.cohort.value,
            class: className,
            startDate: startDate.format(),
            endDate: endDate.format()
        }
        const errors = Object.values(formError);
        try{
            if(!errors.some((error)=>error.error===true)){

            }
            else{
                console.log("There is an error that is preventing the form submission", errors);
            }
        }
        catch(error){
            console.error(error.response.data);
        }
    }

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
                        onSubmit={handleCohortSubmit}
                >
                    <div className={styles.formContainer}>
                        <AuthFormControl width="75%">
                            <SchoolRounded fontSize="large"></SchoolRounded>
                            <FormTextField required type="text" label="Cohort:" name="cohort" isFocused={true} width="100%" variant="light" regex={/^[a-zA-Z]+( [a-zA-Z]+)*$/} onHandleError={handleCohortNameError} errorMessage={"Please enter a valid name"} reset={reset}></FormTextField>
                        </AuthFormControl>
                        <AuthFormControl width="75%">
                            <LaptopRounded fontSize="large"/>
                            <AuthFormControl width="100%" isNested={true}>
                                <FormSelect id={"class"} name={"class"} label={"Class:"} selectValue={className} onSelectValue={handleClassNameChange} list={classList}></FormSelect>
                            </AuthFormControl>
                        </AuthFormControl>
                        <AuthFormControl width="75%">
                            <CalendarMonthRounded fontSize="large"/>
                            <AppDatePicker id={"startDate"} name={"startDate"} label={"Start date:"} dateValue={startDate} onDateValueChange={handleStartDateChange}></AppDatePicker>
                            <AppDatePicker id={"endDate"} name={"endDate"} label={"End date:"} dateValue={endDate} onDateValueChange={handleEndDateChange} minDate={startDate}></AppDatePicker>
                        </AuthFormControl>
                        <AppButton text={"Add new cohort"} type="submit" width="25%" handlerFunction={()=>{}}/>
                    </div>
                </Box>
                <AppDataGrid columns={columns} rows={cohorts}/>
            </Paper>
        </Container>
    )
}

export default Cohorts;
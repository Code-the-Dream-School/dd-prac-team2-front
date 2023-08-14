/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { useNavigate, useParams } from 'react-router-dom';
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
import { Box, Container, Paper, Typography } from '@mui/material';
import AppButton from '../../../components/Button/AppButton';
import AuthFormControl from '../../../components/FormControl/AuthFormControl';
import { CalendarMonthRounded, DateRangeRounded, MenuBook } from '@mui/icons-material';
import FormTextField from '../../../components/TextField/FormTextField';
import dayjs from 'dayjs';
import AppDatePicker from '../../../components/DatePicker/AppDatePicker';
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
    const navigate = useNavigate();


    /*
        ==========================
        =         STATES         =
        ==========================
    */
    const [cohortData, setCohortData] = useState({
        cohortName: "",
        cohortStartDate: "",
        cohortEndDate: "",
    });
    const [cohortWeeks, setCohortWeeks] = useState([]);
    const [weekStartDate, setWeekStartDate] = useState(dayjs());
    const [reset, setReset] = useState(false);
    const [formError, setFormError] = useState({
        weekNameError: {
            error: false,
            errorMessage: "Please enter a valid name"
        },
        weekStartDateError: {
            error: false,
            errorMessage: "Please enter a valid date"
        }
    });

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
        setCohortData({
            cohortName: response.data.cohort[0].name,
            cohortStartDate: response.data.cohort[0].start,
            cohortEndDate: response.data.cohort[0].end
        });
        setWeekStartDate(dayjs(response.data.cohort[0].start));
        setCohortWeeks(formattedWeeks);;
    };

    const postCohortWeek = async (newWeek) => {
        try{
            const response = await axiosPrivate.post("/week",
                newWeek,
            );
            console.log(response);
            return response;
        }
        catch(error){
            console.error(error);
        }
    };

    /*
        ==========================
        =         EFFECTS        =
        ==========================
    */
    useEffect(()=>{
        fetchCohortWeeks();
    }, []);

    /*
        ==========================
        =   HANDLER FUNCTIONS    =
        ==========================
    */
    //1. Handler for week name input:
    const handleWeekNameError = (inputError) => {
        setFormError((prevState)=>(
            {
                ...prevState,
                weekNameError: {
                    ...prevState.cohortError,
                    error: inputError
                }
            }
        ));
    };

    //2. Handler for week start date:
    const handleWeekStartDateChange = (newStartDate) => {
        setWeekStartDate(newStartDate);
        setFormError((prevState)=>(
            {
                ...prevState,
                weekStartDateError: {
                    ...prevState.weekStartDateError,
                    error: weekStartDate < newStartDate ? true:false
                }
            }
        ));
    }

    //3. Handler for form onSubmit:
    const handleWeeksSubmit = async (event) => {
        event.preventDefault();
        const formattedWeek = {
            name: event.target.weekName.value.trim(),
            start: weekStartDate.format(),
            cohortId: cohortId
        }
        console.log(formattedWeek);
        const response = await postCohortWeek(formattedWeek);
        setCohortWeeks((prevCohortWeeks) => [...prevCohortWeeks, {
            id: response.data.week._id,
            weekName: response.data.week.name,
            weekStartDate: new Date(response.data.week.start),
            weekEndDate: new Date(response.data.week.end)
        }]);
    }

    const goBack = () => {
        navigate(-1);
    };

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
                <Typography component={"h1"} sx={{backgroundColor:"#C84B31", borderRadius:2, padding: 1, margin: 1, textAlign: "center", textTransform:"uppercase", fontWeight:"bold", fontSize: 25}} > {cohortData.cohortName}'S weeks management </Typography>
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
                        onSubmit={handleWeeksSubmit}
                >
                    <div className={styles.formContainer}>
                        <AuthFormControl width="75%">
                            <Box sx={{display:"flex", flexDirection:"column", justifyContent:"center"}}>
                                <MenuBook fontSize="large"></MenuBook>
                                <br></br>
                            </Box>
                            <FormTextField required type="text" label="Week name:" name="weekName" isFocused={true} width="100%" variant="light" onHandleError={handleWeekNameError} errorMessage={"Please enter a valid name"} reset={reset}></FormTextField>
                        </AuthFormControl>
                        <AuthFormControl width="75%">
                            <Box sx={{display:"flex", flexDirection:"column", justifyContent:"center"}}>
                                <DateRangeRounded fontSize="large"></DateRangeRounded>
                                <br></br>
                            </Box>
                            <AppDatePicker id={"weekStartDate"} name={"weekStartDate"} label={"Start date:"} dateValue={weekStartDate} onDateValueChange={handleWeekStartDateChange} minDate={dayjs(cohortData.cohortStartDate)} maxDate={dayjs(cohortData.cohortEndDate)} variant={"light"}></AppDatePicker>
                        </AuthFormControl>
                        <AppButton text={"Add new week"} type="submit" width="25%" handlerFunction={()=>{}}/>
                    </div>
                </Box>
                <AppDataGrid columns={columns} rows={cohortWeeks} pageSize={9} fieldToBeSorted={"weekStartDate"} sortType={"asc"}/>
                <div className={styles.buttonContainer}>
                    <AppButton text={"Go back"} type="button" width="100%" handlerFunction={()=>{goBack()}}>            
                    </AppButton>
                </div>
            </Paper>
        </Container>
    );
}

export default Weeks;
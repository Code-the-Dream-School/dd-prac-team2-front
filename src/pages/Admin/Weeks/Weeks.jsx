/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { Box, Container, Paper, Typography } from "@mui/material";
import { DateRangeRounded, MenuBook } from "@mui/icons-material";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import dayjs from "dayjs";
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
/*
    ==========================
    =        STYLES          =
    ==========================
*/
import styles from "./Weeks.module.css";
/*
    ==========================
    =         HOOKS          =
    ==========================
*/
import useAuth from '../../../hooks/useAuth';
/*
    ==========================
    =        COMPONENTS      =
    ==========================
*/
import AppButton from "../../../components/Button/AppButton";
import AuthFormControl from "../../../components/FormControl/AuthFormControl";
import FormTextField from "../../../components/TextField/FormTextField";
import AppDatePicker from "../../../components/DatePicker/AppDatePicker";
import AppDataGrid from "../../../components/DataGrid/AppDataGrid";
import WeeksActions from "./Actions/WeeksActions";

const Weeks = () => {
    /*
        ==========================
        =          HOOKS         =
        ==========================
    */
    const { cohortId } = useParams();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const {setAuth} = useAuth();

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
    // Main state for Cohorts table data:
    const [cohortWeeks, setCohortWeeks] = useState([]);
    // Controlled states for inputs:
    const [weekStartDate, setWeekStartDate] = useState(dayjs());
    const [reset, setReset] = useState(false);
    // Error handling states for form inputs:
    const [formError, setFormError] = useState({
        weekNameError: {
            error: false,
            errorMessage: "Please enter a valid name",
        },
        weekStartDateError: {
            error: false,
            errorMessage: "Please enter a valid date",
        },
    });

    /*
        ==========================
        =      AUX VARIABLES     =
        ==========================
    */
    const columns = [
        { field: "id", headerName: "ID", maxWidth: 130, flex: 1 },
        {
            field: "weekName",
            headerName: "Week",
            minWidth: 270,
            maxWidth: 400,
            flex: 1,
        },
        {
            field: "weekStartDate",
            headerName: "Start date",
            type: "date",
            minWidth: 150,
            maxWidth: 150,
            flex: 1,
        },
        {
            field: "weekEndDate",
            headerName: "End date",
            type: "date",
            minWidth: 150,
            maxWidth: 150,
            flex: 1,
        },
        {
            field: "actions",
            headerName: "Actions",
            sortable: false,
            disableColumnMenu: true,
            flex: 1,
            minWidth: 250,
            maxWidth: 250,
            valueGetter: (params) => params,
            renderCell: (params) => (
                <WeeksActions
                    params={params}
                    cohortId={cohortId}
                    cohortData={cohortData}
                    onHandleCohortWeeks={setCohortWeeks}
                ></WeeksActions>
            ),
        },
    ];
    /*
        ==========================
        =    ASYNC FUNCTIONS     =
        ==========================
    */
    const fetchCohortWeeks = async () => {
        try {
            const response = await axiosPrivate.get(`/cohort/${cohortId}`);
            if (response.status === 200) {
                const formattedWeeks = response.data.cohort[0].weeks.map(
                    (week) => {
                        return {
                            id: week._id,
                            weekName: week.name,
                            weekStartDate: new Date(week.start),
                            weekEndDate: new Date(week.end),
                        };
                    }
                );
                setCohortData({
                    cohortName: response.data.cohort[0].name,
                    cohortStartDate: response.data.cohort[0].start,
                    cohortEndDate: response.data.cohort[0].end,
                });
                setWeekStartDate(dayjs(response.data.cohort[0].start));
                setCohortWeeks(formattedWeeks);
            } else {
                console.error("There was an error fetching the cohortWeeks");
            }
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

    const postCohortWeek = async (newWeek) => {
        try {
            const response = await axiosPrivate.post("/week", newWeek);
            return response;
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

    /*
        ==========================
        =         EFFECTS        =
        ==========================
    */
    useEffect(() => {
        fetchCohortWeeks();
    }, []);

    /*
        ==========================
        =   HANDLER FUNCTIONS    =
        ==========================
    */
    //1. Handler for week name input:
    const handleWeekNameError = (inputError) => {
        setFormError((prevState) => ({
            ...prevState,
            weekNameError: {
                ...prevState.cohortError,
                error: inputError,
            },
        }));
    };

    //2. Handler for week start date:
    const handleWeekStartDateChange = (newStartDate) => {
        setWeekStartDate(newStartDate);
        setFormError((prevState) => ({
            ...prevState,
            weekStartDateError: {
                ...prevState.weekStartDateError,
                error: weekStartDate > newStartDate ? true : false,
            },
        }));
    };

    //3. Handler for form onSubmit:
    const handleWeeksSubmit = async (event) => {
        event.preventDefault();
        const formattedWeek = {
            name: event.target.weekName.value.trim(),
            start: weekStartDate.format(),
            cohortId: cohortId,
        };
        const errors = Object.values(formError);
        try {
            if (!errors.some((error) => error.error === true)) {
                const response = await postCohortWeek(formattedWeek);
                if (response.status === 201) {
                    setCohortWeeks((prevCohortWeeks) => [
                        ...prevCohortWeeks,
                        {
                            id: response.data.week._id,
                            weekName: response.data.week.name,
                            weekStartDate: new Date(response.data.week.start),
                            weekEndDate: new Date(response.data.week.end),
                        },
                    ]);
                }
            } else {
                console.error("Form validation is not letting form submission");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setReset(true);
            setWeekStartDate(dayjs(cohortData.cohortStartDate));
        }
    };

    //4. Function to navigate back
    const goBack = () => {
        navigate(-1);
    };

    return (
        <Container maxWidth="md">
            <Paper
                elevation={3}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    bgcolor: "#1A1A2E",
                    color: "#FFFFFF",
                    borderRadius: "10px",
                    padding: 2,
                    height: "auto",
                }}
            >
                <Typography
                    component={"h1"}
                    sx={{
                        backgroundColor: "#C84B31",
                        borderRadius: 2,
                        padding: 1,
                        margin: 1,
                        textAlign: "center",
                        textTransform: "uppercase",
                        fontWeight: "bold",
                        fontSize: 25,
                    }}
                >
                    {" "}
                    {cohortData.cohortName}'S weeks management{" "}
                </Typography>
                <Box
                    component={"form"}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                    }}
                    autoComplete="off"
                    onSubmit={handleWeeksSubmit}
                >
                    <div className={styles.formContainer}>
                        <AuthFormControl width="75%">
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                }}
                            >
                                <MenuBook fontSize="large"></MenuBook>
                                <br></br>
                                <br></br>
                            </Box>
                            <FormTextField
                                required
                                type="text"
                                label="Week name:"
                                name="weekName"
                                isFocused={true}
                                width="100%"
                                variant="light"
                                onHandleError={handleWeekNameError}
                                errorMessage={"Please enter a valid name"}
                                reset={reset}
                            ></FormTextField>
                        </AuthFormControl>
                        <AuthFormControl width="75%">
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                }}
                            >
                                <DateRangeRounded fontSize="large"></DateRangeRounded>
                                <br></br>
                            </Box>
                            <AppDatePicker
                                id={"weekStartDate"}
                                name={"weekStartDate"}
                                label={"Start date:"}
                                dateValue={weekStartDate}
                                onDateValueChange={handleWeekStartDateChange}
                                minDate={dayjs(cohortData.cohortStartDate)}
                                maxDate={dayjs(cohortData.cohortEndDate)}
                                variant={"light"}
                            ></AppDatePicker>
                        </AuthFormControl>
                        <AppButton
                            text={"Add new week"}
                            type="submit"
                            width="25%"
                            handlerFunction={() => {}}
                        />
                    </div>
                </Box>
                <AppDataGrid
                    columns={columns}
                    rows={cohortWeeks}
                    pageSize={9}
                    fieldToBeSorted={"weekStartDate"}
                    sortType={"asc"}
                />
                <div className={styles.buttonContainer}>
                    <AppButton
                        text={"Go back"}
                        type="button"
                        width="100%"
                        handlerFunction={() => {
                            goBack();
                        }}
                    ></AppButton>
                </div>
            </Paper>
        </Container>
    );
};

export default Weeks;

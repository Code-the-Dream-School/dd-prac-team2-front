/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { Box, Container, Paper, Typography, styled } from "@mui/material";
import {
    CalendarMonthRounded,
    LaptopRounded,
    SchoolRounded,
} from "@mui/icons-material";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import dayjs from "dayjs";
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React, { useEffect, useState } from "react";
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
import AuthFormControl from "../../../components/FormControl/AuthFormControl";
import FormTextField from "../../../components/TextField/FormTextField";
import FormSelect from "../../../components/Select/FormSelect";
import AppButton from "../../../components/Button/AppButton";
import AppDataGrid from "../../../components/DataGrid/AppDataGrid";
import AppDatePicker from "../../../components/DatePicker/AppDatePicker";
import CohortsActions from "./Actions/CohortsActions";
/*
    ==========================
    =     AUX VARIABLES      =
    ==========================
*/
const classList = [
    "Intro to programming",
    "React.js",
    "Node.js/Express",
    "Ruby on Rails",
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
            errorMessage: "Please enter a valid name",
        },
        classNameError: {
            error: true, //Initial value is blank, this is why I set the error to true.
            errorMessage: "Please select a class for this cohort",
        },
        startDateError: {
            error: false,
            errorMessage: "Please select a start date for this cohort",
        },
        endDateError: {
            error: false,
            errorMessage: "Please select an end date for this cohort",
        },
    });
    const [cohorts, setCohorts] = useState([]);
    const columns = [
        { field: "id", headerName: "ID", maxWidth: 130, flex: 1 },
        {
            field: "cohort",
            headerName: "Cohort",
            minWidth: 200,
            maxWidth: 200,
            flex: 1,
        },
        {
            field: "class",
            headerName: "Class",
            minWidth: 200,
            maxWidth: 200,
            flex: 1,
        },
        {
            field: "startDate",
            headerName: "Start date",
            type: "date",
            minWidth: 150,
            maxWidth: 150,
            flex: 1,
        },
        {
            field: "endDate",
            headerName: "End date",
            type: "date",
            minWidth: 150,
            maxWidth: 150,
        },
        {
            field: "actions",
            headerName: "Actions",
            sortable: false,
            disableColumnMenu: true,
            flex: 1,
            minWidth: 400,
            maxWidth: 400,
            valueGetter: (params) => params,
            renderCell: (params) => (
                <CohortsActions
                    params={params}
                    onHandleCohorts={setCohorts}
                ></CohortsActions>
            ),
        },
    ];
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
    const postCohorts = async (newCohort) => {
        console.log(newCohort);
        try {
            const response = await axiosPrivate.post("/cohort", newCohort);
            return response;
        } catch (error) {
            console.error(error);
        }
    };

    /* 
        ==========================
        =        EFFECTS         =
        ==========================
    */
    useEffect(() => {
        setReset(false);
    });

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const fetchCohorts = async () => {
            try {
                const response = await axiosPrivate.get("/cohort", {
                    signal: controller.signal,
                });
                console.log(response);
                const formattedCohorts = response.data.cohorts.map((cohort) => {
                    return {
                        id: cohort._id,
                        cohort: cohort.name,
                        class: cohort.type,
                        startDate: new Date(cohort.start),
                        endDate: new Date(cohort.end),
                    };
                });
                console.log(formattedCohorts);
                isMounted && setCohorts(formattedCohorts);
            } catch (error) {
                console.error(error);
            }
        };

        fetchCohorts();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);
    /*
        ==========================
        =         HANDLERS       =
        ==========================
    */
    //1. Cohort errorHandler:
    const handleCohortNameError = (inputError) => {
        setFormError((prevState) => ({
            ...prevState,
            cohortError: {
                ...prevState.cohortError,
                error: inputError,
            },
        }));
    };
    //2. Class name handler
    const handleClassNameChange = (selectedClassName) => {
        setClassName(selectedClassName);
        setFormError((prevState) => ({
            ...prevState,
            classNameError: {
                ...prevState.classNameError,
                error: false,
            },
        }));
    };
    //3. Start date handler
    const handleStartDateChange = (newStartDate) => {
        setStartDate(newStartDate);
        setFormError((prevState) => ({
            ...prevState,
            endDateError: {
                ...prevState.endDateError,
                error: endDate < newStartDate ? true : false,
            },
        }));
    };
    //4. End date handler
    const handleEndDateChange = (newEndDate) => {
        setEndDate(newEndDate);
        setFormError((prevState) => ({
            ...prevState,
            startDateError: {
                ...prevState.startDateError,
                error: newEndDate < startDate ? true : false,
            },
            endDateError: {
                ...prevState.endDateError,
                error: newEndDate < startDate ? true : false,
            },
        }));
    };
    //5. Form onSubmit event handler
    const handleCohortSubmit = async (event) => {
        event.preventDefault();
        const newCohort = {
            name: event.target.cohort.value.trim(),
            start: startDate.format(),
            end: endDate.format(),
            type: className,
        };
        const errors = Object.values(formError);
        try {
            if (!errors.some((error) => error.error === true)) {
                const response = await postCohorts(newCohort);
                console.log(response);
                if (response.status === 201) {
                    console.log(cohorts);
                    setCohorts((prevCohorts) => [
                        ...prevCohorts,
                        {
                            id: response.data.cohort._id,
                            cohort: response.data.cohort.name,
                            class: response.data.cohort.type,
                            startDate: new Date(response.data.cohort.start),
                            endDate: new Date(response.data.cohort.end),
                        },
                    ]);
                }
            } else {
                console.error("Form validation is not letting form submission");
            }
        } catch (error) {
            console.error(error.response.data);
        } finally {
            setReset(true);
            setClassName("");
            setStartDate(dayjs());
            setEndDate(dayjs());
        }
    };

    return (
        <Container maxWidth="lg">
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
                        fontWeight: "bold",
                        fontSize: 25,
                    }}
                >
                    {" "}
                    COHORTS MANAGEMENT{" "}
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
                    onSubmit={handleCohortSubmit}
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
                                <SchoolRounded fontSize="large"></SchoolRounded>
                                <br></br>
                            </Box>
                            <FormTextField
                                required
                                type="text"
                                label="Cohort:"
                                name="cohort"
                                isFocused={true}
                                width="100%"
                                variant="light"
                                regex={/^[a-zA-Z]+( [a-zA-Z]+)*$/}
                                onHandleError={handleCohortNameError}
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
                                <LaptopRounded fontSize="large" />
                                <br></br>
                            </Box>
                            <AuthFormControl
                                width="100%"
                                isNested={true}
                                error={formError.classNameError.error}
                            >
                                <FormSelect
                                    id={"class"}
                                    name={"class"}
                                    label={"Class:"}
                                    selectValue={className}
                                    onSelectValue={handleClassNameChange}
                                    list={classList}
                                    variant={"light"}
                                    multiple={false}
                                    error={formError.classNameError}
                                ></FormSelect>
                            </AuthFormControl>
                        </AuthFormControl>
                        <AuthFormControl width="75%">
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                }}
                            >
                                <CalendarMonthRounded fontSize="large" />
                                <br></br>
                            </Box>
                            <AppDatePicker
                                id={"startDate"}
                                name={"startDate"}
                                label={"Start date:"}
                                dateValue={startDate}
                                onDateValueChange={handleStartDateChange}
                                variant={"light"}
                            ></AppDatePicker>
                            <AppDatePicker
                                id={"endDate"}
                                name={"endDate"}
                                label={"End date:"}
                                dateValue={endDate}
                                onDateValueChange={handleEndDateChange}
                                minDate={startDate}
                                variant={"light"}
                            ></AppDatePicker>
                        </AuthFormControl>
                        <AppButton
                            text={"Add new cohort"}
                            type="submit"
                            width="25%"
                            handlerFunction={() => {}}
                        />
                    </div>
                </Box>
                <AppDataGrid
                    columns={columns}
                    rows={cohorts}
                    fieldToBeSorted={"class"}
                    sortType={"asc"}
                />
            </Paper>
        </Container>
    );
};

export default Cohorts;

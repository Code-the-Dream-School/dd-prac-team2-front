/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Slide, Typography } from '@mui/material';
import { Close, DateRangeRounded, MenuBook } from '@mui/icons-material';
import dayjs from 'dayjs';
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React, {useState, forwardRef} from 'react';
/*
    ==========================
    =        STYLES          =
    ==========================
*/
import styles from "../Weeks.module.css";
/*
    ==========================
    =        COMPONENTS      =
    ==========================
*/
import AppButton from '../../../../components/Button/AppButton';
import AuthFormControl from '../../../../components/FormControl/AuthFormControl';
import FormTextField from '../../../../components/TextField/FormTextField';
import AppDatePicker from '../../../../components/DatePicker/AppDatePicker';
/*
    ==========================
    =          HOOKS         =
    ==========================
*/
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const EditCohortWeek = ({openDialog, cohortData, weekInfo, onCloseDialog, onHandleCohortWeeks}) => {
    const axiosPrivate = useAxiosPrivate();
    /*
        ==========================
        =         STATES         =
        ==========================
    */
    const [weekName, setWeekName] = useState(weekInfo.row.weekName);
    const [weekStartDate, setWeekStartDate] = useState(dayjs(weekInfo.row.weekStartDate));
    const [reset, setReset] = useState(false);
    // Error handling states for form inputs:
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
    console.log(formError);
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
                    error: cohortData.startDate > newStartDate ? true:false
                }
            }
        ));
    };

    //3. Handler for onSubmit event:
    const handleEditCohortWeekSubmit = async(event) => {
        event.preventDefault();
        const weekToBeUpdated = weekInfo.row.id;
        const formattedUpdatedWeek = {
            name: event.target.weekName.value ,
            start: weekStartDate.format(),
        }
        const errors = Object.values(formError);
        try{
            if(!errors.some((error)=>error.error===true)){
                const response = await axiosPrivate.patch(`/week/${weekToBeUpdated}`,
                    formattedUpdatedWeek
                );
                if (response.status === 201){
                    onHandleCohortWeeks((prevCohortWeeks) =>
                            (prevCohortWeeks).map((week) => {
                                    console.log(week);
                                    if (week.id === weekToBeUpdated){
                                        return ({
                                            id: weekToBeUpdated,
                                            weekName: formattedUpdatedWeek.name,
                                            weekStartDate: new Date(formattedUpdatedWeek.start),
                                            weekEndDate: new Date(response.data.week.end)
                                        });
                                    }
                                    else{
                                        return week;
                                    }
                                }
                            )
                    );
                    onCloseDialog();
                    setReset(true);
                    setWeekName("");
                    setWeekStartDate(dayjs(weekInfo.row.weekStartDate));
                }
            }
            else{
                console.error("Form validation is not letting form submission");
            }
        }
        catch(error){
            console.error(error);
        }

    }

    return (
        <Dialog open={openDialog} TransitionComponent={Transition} onClose={onCloseDialog} fullWidth maxWidth="sm">
            <DialogTitle display={"flex"} justifyContent={"space-between"} alignItems={"center"} gap={"5px"} component={"div"}> 
                <Typography variant="h1" textAlign={"center"} fontSize={"30px"} fontWeight={"bold"}>Edit week: </Typography>
                <AppButton text={""} type="button" width='10%' handlerFunction={()=>{onCloseDialog()}}>
                    <Close></Close>
                </AppButton>
            </DialogTitle>
            <Box
                component={"form"}
                sx={{
                    display:"flex",
                    flexDirection:"column",
                    justifyContent:"center",
                    alignItems:"center",
                    width:"100%",
                    color: "#C84B31"
                }}
                autoComplete="off"
                onSubmit={handleEditCohortWeekSubmit}
            >
                <DialogContent sx={{width:"100%", paddingX:0, paddingY:1}} dividers>
                    <div className={styles.formContainer}>
                        <AuthFormControl width="75%">
                            <Box sx={{display:"flex", flexDirection:"column", justifyContent:"center"}}>
                                <MenuBook fontSize="large"></MenuBook>
                                <br></br>
                            </Box>
                            <FormTextField required value={weekName} type="text" label="Week name:" name="weekName" isFocused={true} width="100%" variant="dark" onHandleError={handleWeekNameError} errorMessage={"Please enter a valid name"} reset={reset}></FormTextField>
                        </AuthFormControl>
                        <AuthFormControl width="75%">
                            <Box sx={{display:"flex", flexDirection:"column", justifyContent:"center"}}>
                                <DateRangeRounded fontSize="large"></DateRangeRounded>
                                <br></br>
                            </Box>
                            <AppDatePicker id={"weekStartDate"} name={"weekStartDate"} label={"Start date:"} dateValue={weekStartDate} onDateValueChange={handleWeekStartDateChange} minDate={dayjs(cohortData.cohortStartDate)} maxDate={dayjs(cohortData.cohortEndDate)} variant={"dark"}></AppDatePicker>
                        </AuthFormControl>
                    </div>
                </DialogContent>
                <DialogActions sx={{display:"flex", justifyContent:"center"}}>
                    <AppButton text={"Edit cohort"} type="submit" width="100%" handlerFunction={()=>{}}/>
                </DialogActions>    
            </Box>
        </Dialog>
    );
}

export default EditCohortWeek;

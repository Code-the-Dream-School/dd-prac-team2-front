/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Typography,
} from "@mui/material";
import {
  CalendarMonthRounded,
  Close,
  LaptopRounded,
  SchoolRounded,
} from "@mui/icons-material";
import PropTypes from "prop-types";
import dayjs from "dayjs";
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React, { forwardRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
/*
    ==========================
    =       COMPONENTS       =
    ==========================
*/
import AppButton from "../../../../components/Button/AppButton";
import FormTextField from "../../../../components/TextField/FormTextField";
import AuthFormControl from "../../../../components/FormControl/AuthFormControl";
import FormSelect from "../../../../components/Select/FormSelect";
import AppDatePicker from "../../../../components/DatePicker/AppDatePicker";
import Loader from "../../../../components/Loader/Loader";
/*
    ==========================
    =          STYLES        =
    ==========================
*/
import styles from "../Cohorts.module.css";
/*
    ==========================
    =          HOOKS         =
    ==========================
*/
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import useAuth from "../../../../hooks/useAuth";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
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

const EditCohort = ({
  openDialog,
  cohortInfo,
  onCloseDialog,
  onHandleCohorts,
}) => {
  /*
        ==========================
        =         HOOKS          =
        ==========================
    */
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();

  /*
        ==========================
        =         STATES         =
        ==========================
    */
  const [cohortName, setCohortName] = useState(cohortInfo.row.cohort);
  const [className, setClassName] = useState(cohortInfo.row.class);
  const [startDate, setStartDate] = useState(dayjs(cohortInfo.row.startDate));
  const [endDate, setEndDate] = useState(dayjs(cohortInfo.row.endDate));
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState({
    cohortError: {
      error: false,
      errorMessage: "Please enter a valid name",
    },
    classNameError: {
      error: false, //Initial value will always be filled, this is why I set the error to false.
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
  const [reset, setReset] = useState(false);

  /*
        ==========================
        =        EFFECTS         =
        ==========================
    */
  //1. Used to set reset textfield value to false as it will only be true when user submits a form.
  useEffect(() => {
    setReset(false);
  });

  /*
        ==========================
        =    ASYNC FUNCTIONS     =
        ==========================
    */
  const editCohort = async (cohortId, editedCohort) => {
    setLoading(true);
    try {
      const response = await axiosPrivate.patch(
        `/cohort/${cohortId}`,
        editedCohort
      );
      setLoading(false);
      return response;
    } catch (error) {
      if (error.response.status === 403) {
        console.error(error);
        //User is required to validate auth again
        setLoading(false);
        navigate("/login", { state: { from: location }, replace: true });
        setAuth({
          userId: "",
          userName: "",
          userEmail: "",
          role: [],
          loggedIn: false,
          avatarUrl: "",
          isActive: undefined,
          accessToken: "",
        });
      } else {
        console.error(error);
        setLoading(false);
      }
    }
  };

  /*
        ==========================
        =        HANDLERS        =
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
  //5. onSubmit event
  const handleEditCohortSubmit = async (event) => {
    event.preventDefault();
    const cohortToBeUpdated = cohortInfo.row.id;
    const editedCohort = {
      name: event.target.cohort.value.trim(),
      start: startDate.format(), //Date needs to be sent with .format()
      end: endDate.format(), //Date needs to be sent with .format()
      type: className,
    };
    const errors = Object.values(formError);
    try {
      if (!errors.some((error) => error.error === true)) {
        const response = await editCohort(cohortToBeUpdated, editedCohort);
        if (response.status === 201) {
          onHandleCohorts((prevCohorts) =>
            prevCohorts.map((prevCohort) => {
              if (prevCohort.id === cohortToBeUpdated) {
                return {
                  ...prevCohort,
                  cohort: editedCohort.name,
                  class: editedCohort.type,
                  startDate: new Date(editedCohort.start), //Date needs to be received as new Date()
                  endDate: new Date(editedCohort.end), //Date needs to be received as new Date()
                };
              } else {
                return prevCohort;
              }
            })
          );
          setReset(true);
          setCohortName("");
          setClassName("");
          setStartDate(dayjs());
          setEndDate(dayjs());
          onCloseDialog(true);
        }
      } else {
        console.log(
          "There is an error that is preventing the form submission",
          errors
        );
      }
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return (
    <Dialog
      open={openDialog}
      TransitionComponent={Transition}
      onClose={onCloseDialog}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        gap={"5px"}
        component={"div"}
      >
        <Typography
          variant="h1"
          textAlign={"center"}
          fontSize={"30px"}
          fontWeight={"bold"}
        >
          Edit cohort:{" "}
        </Typography>
        <AppButton
          text={""}
          type="button"
          width="10%"
          handlerFunction={() => {
            onCloseDialog();
          }}
        >
          <Close></Close>
        </AppButton>
      </DialogTitle>
      <Box
        component={"form"}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          color: "#C84B31",
        }}
        autoComplete="off"
        onSubmit={handleEditCohortSubmit}
      >
        <DialogContent
          sx={{ width: "100%", paddingX: 0, paddingY: 1 }}
          dividers
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
                <br></br>
              </Box>
              <FormTextField
                required
                value={cohortName}
                type="text"
                label="Cohort:"
                name="cohort"
                isFocused={true}
                width="100%"
                variant="dark"
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
              <AuthFormControl width="100%" isNested={true}>
                <FormSelect
                  id={"class"}
                  name={"class"}
                  label={"Class:"}
                  selectValue={className}
                  onSelectValue={handleClassNameChange}
                  list={classList}
                  variant="dark"
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
                variant={"dark"}
              ></AppDatePicker>
              <AppDatePicker
                id={"endDate"}
                name={"endDate"}
                label={"End date:"}
                dateValue={endDate}
                onDateValueChange={handleEndDateChange}
                minDate={startDate}
                variant={"dark"}
              ></AppDatePicker>
            </AuthFormControl>
          </div>
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
          <AppButton
            text={"Edit cohort"}
            type="submit"
            width="100%"
            handlerFunction={() => {}}
          />
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default EditCohort;

EditCohort.propTypes = {
  openDialog: PropTypes.bool.isRequired,
  cohortInfo: PropTypes.object.isRequired,
  onCloseDialog: PropTypes.func.isRequired,
  onHandleCohorts: PropTypes.func.isRequired,
};

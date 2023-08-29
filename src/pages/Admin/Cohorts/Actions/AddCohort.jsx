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
import dayjs from "dayjs";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import PropTypes from "prop-types"

/*
      ==========================
      =     REACT LIBRARIES    =
      ==========================
  */
import React, { forwardRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
/*
      ==========================
      =         HOOKS          =
      ==========================
  */
import useAuth from "../../../../hooks/useAuth";
/*
      ==========================
      =        STYLES          =
      ==========================
  */
import styles from "../Cohorts.module.css";
/*
      ==========================
      =        COMPONENTS      =
      ==========================
  */
import AppButton from "../../../../components/Button/AppButton";
import Loader from "../../../../components/Loader/Loader";
import AuthFormControl from "../../../../components/FormControl/AuthFormControl";
import FormTextField from "../../../../components/TextField/FormTextField";
import FormSelect from "../../../../components/Select/FormSelect";
import AppDatePicker from "../../../../components/DatePicker/AppDatePicker";
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

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AddCohort = ({ open, handleOpen, onRegisterCohort }) => {
  /*
      ==========================
      =         STATES         =
      ==========================
    */
  const [reset, setReset] = useState(false);
  const [className, setClassName] = useState("");
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [loading, setLoading] = useState(false);
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
      =     ASYNC FUNCTIONS    =
      ==========================
    */
  const postCohorts = async (newCohort) => {
    console.log(newCohort);
    try {
      const response = await axiosPrivate.post("/cohort", newCohort);
      return response;
    } catch (error) {
      if (error.response.status === 403) {
        console.error(error);
        //User is required to validate auth again
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
      }
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
    console.log("I entered");
    event.preventDefault();
    const newCohort = {
      name: event.target.cohort.value.trim(),
      start: startDate.format(),
      end: endDate.format(),
      type: className,
    };
    const errors = Object.values(formError);
    try {
      setLoading(true);
      if (!errors.some((error) => error.error === true)) {
        const response = await postCohorts(newCohort);
        console.log(response);
        if (response.status === 201) {
          setLoading(false); // Stop loading in case of error
          onRegisterCohort((prevCohorts) => [
            ...prevCohorts,
            {
              id: response.data.cohort._id,
              cohort: response.data.cohort.name,
              class: response.data.cohort.type,
              startDate: new Date(response.data.cohort.start),
              endDate: new Date(response.data.cohort.end),
            },
          ]);
          handleOpen(false);
        }
      } else {
        setLoading(false); // Stop loading in case of error
        console.error("Form validation is not letting form submission");
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    } finally {
      setReset(true);
      setClassName("");
      setStartDate(dayjs());
      setEndDate(dayjs());
    }
  };

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={() => handleOpen(false)}
        fullWidth
        maxWidth="md"
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
            Add a new cohort:
          </Typography>
          <AppButton
            text={""}
            type="button"
            width="10%"
            handlerFunction={() => handleOpen(false)}
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
            color: "#C84B31",
          }}
          autoComplete="off"
          onSubmit={handleCohortSubmit}
        >
          {loading ? (
            <DialogContent
              sx={{ width: "100%", height: "auto", paddingX: 0, paddingY: 1 }}
              dividers
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "100px",
                }}
              >
                <Loader />
              </Box>
            </DialogContent>
          ) : (
            <>
              <DialogContent
                sx={{ width: "100%", height: "auto", paddingX: 0, paddingY: 1 }}
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
                        variant={"dark"}
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
                  text={"Add cohort"}
                  type="submit"
                  width="auto"
                  handlerFunction={() => {}}
                ></AppButton>
              </DialogActions>
            </>
          )}
        </Box>
      </Dialog>
    </>
  );
};

export default AddCohort;

AddCohort.propTypes = {
    open: PropTypes.bool.isRequired,
    handleOpen: PropTypes.func.isRequired,
    onRegisterCohort: PropTypes.func.isRequired
}

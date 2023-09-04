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
import PropTypes from "prop-types";

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
import ToastMessage from "../../../../components/ToastMessage/ToastMessage";
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

const AddCohort = ({
  open,
  handleOpen,
  onRegisterSlackChannel,
  onRegisterCohort,
  slackChannelData,
}) => {
  console.log(slackChannelData);
  /*
    ==========================
    =         STATES         =
    ==========================
  */
  const [reset, setReset] = useState(false);
  const [cohortName, setCohortName] = useState(slackChannelData?.name ?? "");
  const [className, setClassName] = useState(slackChannelData?.type ?? "");
  const [startDate, setStartDate] = useState(
    dayjs(slackChannelData?.startDate) ?? dayjs()
  );
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState({
    cohortError: {
      error: false,
      errorMessage: "Please enter a valid name",
    },
    classNameError: {
      error: slackChannelData === undefined ? true : false, //Initial value is blank, this is why I set the error to true.
      errorMessage: "Please select a class for this cohort",
    },
    startDateError: {
      error: false,
      errorMessage: "Please select a start date for this cohort",
    },
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [openSuccessToast, setOpenSuccessToast] = useState(false);
  const [openErrorToast, setOpenErrorToast] = useState(false);
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
        setSuccessMessage("");
        setErrorMessage("");
        setErrorMessage(
          `Error. New cohort was not added. ${error.response.data.msg}.`
        );
        setOpenErrorToast(true);
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
  };

  //4. Form onSubmit event handler
  const handleCohortSubmit = async (event) => {
    console.log("I entered");
    event.preventDefault();
    const newCohort = {
      slackId: slackChannelData?.slackId ?? null,
      name: event.target.cohort.value.trim(),
      start: startDate.format(),
      type: className,
    };
    const errors = Object.values(formError);

    try {
      setLoading(true);
      if (!errors.some((error) => error.error === true)) {
        const response = await postCohorts(newCohort);
        console.log(response);
        setLoading(false); // Stop loading
        if (response.status === 201) {
          setLoading(false); // Stop loading in case of error
          const options = { year: "2-digit", month: "numeric", day: "numeric" };
          const dateTimeFormat = new Intl.DateTimeFormat("en", options);
          onRegisterCohort((prevCohorts) => [
            ...prevCohorts,
            {
              id: response.data.cohort._id,
              slackId: response.data.cohort.slackId,
              cohort: response.data.cohort.name,
              class: response.data.cohort.type,
              members: response.data.cohort.participants.length,
              startEndDate: dateTimeFormat.formatRange(
                new Date(response.data.cohort.start),
                new Date(response.data.cohort.end)
              ),
            },
          ]);
          if (slackChannelData !== undefined) {
            onRegisterSlackChannel((prevSlackChannels) =>
              prevSlackChannels.filter(
                (slackChannel) =>
                  slackChannel.slackId !== slackChannelData.slackId
              )
            );
          }
          setSuccessMessage("");
          setErrorMessage("");
          setSuccessMessage("Success. New cohort has been added successfully!");
          setOpenSuccessToast(true);
        }
      } else {
        setSuccessMessage("");
        setErrorMessage("");
        setOpenErrorToast(true);
        // setErrorMessage(response.data.msg);
        setErrorMessage("Form validation is not letting form submission.");
        console.error("Form validation is not letting form submission");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    } finally {
      setReset(true);
      setCohortName("");
      setClassName("");
      setStartDate(dayjs());
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
          <>
            {loading ? <Loader /> : null}
            <DialogContent
              sx={{
                width: "100%",
                height: "auto",
                paddingX: 0,
                paddingY: 1,
              }}
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
              <ToastMessage
                open={openErrorToast}
                severity="error"
                variant="filled"
                onClose={() => setOpenErrorToast(false)}
                dismissible
                // sx={{ background: "white", color: "#CD1818" }}
                // background="#cd1818"
                // color="white"
                message={errorMessage}
              ></ToastMessage>

              <ToastMessage
                open={openSuccessToast}
                severity="success"
                variant="filled"
                // autoHideDuration={3000}
                onClose={() => setOpenSuccessToast(false)}
                dismissible
                // sx={{ background: "white", color: "#CD1818" }}
                message={successMessage}
              ></ToastMessage>
            </DialogActions>
          </>
        </Box>
      </Dialog>
    </>
  );
};

export default AddCohort;

AddCohort.propTypes = {
  open: PropTypes.bool.isRequired,
  handleOpen: PropTypes.func.isRequired,
  onRegisterSlackChannel: PropTypes.func,
  onRegisterCohort: PropTypes.func.isRequired,
  slackChannelData: PropTypes.object,
  onRegisterCohort: PropTypes.func.isRequired,
};

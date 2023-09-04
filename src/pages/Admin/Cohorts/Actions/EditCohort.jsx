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
  Close,
  DeleteRounded,
  EditRounded,
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
import Loader from "../../../../components/Loader/Loader";
import ToastMessage from "../../../../components/ToastMessage/ToastMessage";
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
  const [formError, setFormError] = useState({
    cohortError: {
      error: false,
      errorMessage: "Please enter a valid name",
    },
    classNameError: {
      error: false, //Initial value will always be filled, this is why I set the error to false.
      errorMessage: "Please select a class for this cohort",
    },
  });
  const [reset, setReset] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [openSuccessToast, setOpenSuccessToast] = useState(false);
  const [openErrorToast, setOpenErrorToast] = useState(false);

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
    try {
      const response = await axiosPrivate.patch(
        `/cohort/${cohortId}`,
        editedCohort
      );
      console.log(response);
      setLoading(false);
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

  //5. onSubmit event
  const handleEditCohortSubmit = async (event) => {
    event.preventDefault();
    const cohortToBeUpdated = cohortInfo.row.id;
    const editedCohort = {
      name: event.target.cohort.value.trim(),
      type: className,
    };
    const errors = Object.values(formError);
    try {
      setLoading(true);
      if (!errors.some((error) => error.error === true)) {
        const response = await editCohort(cohortToBeUpdated, editedCohort);
        console.log(response);
        setLoading(false); // Stop loading
        const options = { year: "2-digit", month: "numeric", day: "numeric" };
        const dateTimeFormat = new Intl.DateTimeFormat("en", options);
        if (response.status === 201) {
          onHandleCohorts((prevCohorts) =>
            prevCohorts.map((prevCohort) => {
              if (prevCohort.id === cohortToBeUpdated) {
                return {
                  ...prevCohort,
                  cohort: response.data.cohort.name,
                  class: response.data.cohort.type,
                  startEndDate: dateTimeFormat.formatRange(
                    new Date(response.data.cohort.start),
                    new Date(response.data.cohort.end)
                  ),
                };
              } else {
                return prevCohort;
              }
            })
          );
          setReset(true);
          setCohortName("");
          setClassName("");
          onCloseDialog(true);
        }
      } else {
        setSuccessMessage("");
        setErrorMessage("");
        setOpenErrorToast(true);
        // setErrorMessage(response.data.msg);
        setErrorMessage(
          "There is an error that is preventing the form submission",
          errors
        );
        console.log(
          "There is an error that is preventing the form submission",
          errors
        );
      }
    } catch (error) {
      setLoading(false);
      setSuccessMessage("");
      setErrorMessage("");
      setErrorMessage(`Error. ${error}. Please try again!`);
      setOpenErrorToast(true);
      console.error(error.response.data);
    }
  };

  const handleDeleteCohort = async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.delete(
        `/cohort/${cohortInfo.row.id}`,
        {
          withCredentials: true,
        }
      );
      setSuccessMessage("");
      setErrorMessage("");
      setSuccessMessage("Success. New cohort has been removed successfully!");
      setOpenSuccessToast(true);
      console.log(response);
      setLoading(false); // Stop loading
      if (response.status === 200) {
        onHandleCohorts((prevCohorts) => {
          return prevCohorts.filter(
            (cohort) => cohort.id !== cohortInfo.row.id
          );
        });
        setSuccessMessage("");
        setErrorMessage("");
        setOpenErrorToast(true);
        // setErrorMessage(response.data.msg);
        setErrorMessage("error! Cohor was not removed!");
        console.error(response);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      setSuccessMessage("");
      setErrorMessage("");
      setErrorMessage(
        `Error. New cohort was not rempved. ${error}. Please try again!`
      );
      setOpenErrorToast(true);
      if (error.response.status === 403) {
        //User is required to validate auth again
        console.error(error);
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
        setErrorMessage(`Error.${error}. Please try again!`);
        setOpenErrorToast(true);
      }
    }
    setLoading(false);
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
        {loading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Loader />
          </Box>
        ) : null}
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
          </div>
        </DialogContent>

        <DialogActions
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: "75%",
          }}
        >
          <AppButton
            text={"Edit cohort"}
            type="submit"
            width="50%"
            handlerFunction={() => {}}
          >
            <EditRounded></EditRounded>
          </AppButton>
          {cohortInfo.row.members === 0 ? (
            <AppButton
              text={"Delete"}
              type="button"
              width="50%"
              color="#CD1818"
              handlerFunction={() => handleDeleteCohort()}
            >
              <DeleteRounded></DeleteRounded>
            </AppButton>
          ) : null}
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

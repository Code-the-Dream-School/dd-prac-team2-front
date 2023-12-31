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
import { Close, DateRangeRounded, MenuBook } from "@mui/icons-material";
import dayjs from "dayjs";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import PropTypes from "prop-types";

/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React, { useState, forwardRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
import AppButton from "../../../../components/Button/AppButton";
import AuthFormControl from "../../../../components/FormControl/AuthFormControl";
import FormTextField from "../../../../components/TextField/FormTextField";
import AppDatePicker from "../../../../components/DatePicker/AppDatePicker";
/*
    ==========================
    =          HOOKS         =
    ==========================
*/
import useAuth from "../../../../hooks/useAuth";
import Loader from "../../../../components/Loader/Loader";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EditCohortWeek = ({
  openDialog,
  cohortId,
  cohortData,
  weekInfo,
  onLoadingCover,
  onCloseDialog,
  onHandleCohortWeeks,
  onToast,
}) => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();
  /*
        ==========================
        =         STATES         =
        ==========================
    */
  const [weekName, setWeekName] = useState(weekInfo.row.weekName);
  const [weekStartDate, setWeekStartDate] = useState(
    dayjs(weekInfo.row.weekStartDate)
  );
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
    const errors = Object.values(newStartDate);
    if (!dayjs(errors[2]).isValid()) {
      setFormError((prevState) => ({
        ...prevState,
        weekStartDateError: {
          ...prevState.weekStartDateError,
          error: true,
        },
      }));
      setWeekStartDate(dayjs(newStartDate));
    } else {
      setFormError((prevState) => ({
        ...prevState,
        weekStartDateError: {
          ...prevState.weekStartDateError,
          error: false,
        },
      }));
      if (
        newStartDate < dayjs(cohortData.cohortStartDate) ||
        newStartDate > dayjs(cohortData.cohortEndDate)
      ) {
        setFormError((prevState) => ({
          ...prevState,
          weekStartDateError: {
            ...prevState.weekStartDateError,
            error: true,
          },
        }));
        setWeekStartDate(dayjs(newStartDate));
      } else {
        setFormError((prevState) => ({
          ...prevState,
          weekStartDateError: {
            ...prevState.weekStartDateError,
            error: false,
          },
        }));
        setWeekStartDate(dayjs(newStartDate));
      }
    }
  };

  //3. Handler for onSubmit event:
  const handleEditCohortWeekSubmit = async (event) => {
    event.preventDefault();
    onLoadingCover(true);
    const weekToBeUpdated = weekInfo.row.id;
    const formattedUpdatedWeek = {
      name: event.target.weekName.value,
      start: weekStartDate.format(),
    };
    const errors = Object.values(formError);
    try {
      if (!errors.some((error) => error.error === true)) {
        const response = await axiosPrivate.patch(
          `/week/${cohortId}/${weekToBeUpdated}`,
          formattedUpdatedWeek
        );
        if (response.status === 201) {
          onHandleCohortWeeks((prevCohortWeeks) =>
            prevCohortWeeks.map((week) => {
              if (week.id === weekToBeUpdated) {
                return {
                  id: weekToBeUpdated,
                  weekName: formattedUpdatedWeek.name,
                  weekStartDate: new Date(formattedUpdatedWeek.start),
                  weekEndDate: new Date(response.data.week.end),
                };
              } else {
                return week;
              }
            })
          );
          onToast({
            isOpened: true,
            severity: "success",
            message: `Success! Week, '${response.data.week.name}', has been updated.`,
          });
          onLoadingCover(false);
          onCloseDialog();
        }
      } else {
        onLoadingCover(false);
        onToast({
          isOpened: true,
          severity: "warning",
          message: `Warning! Please enter valid data into the form fields`,
        });
      }
    } catch (error) {
      if (error.response.status === 403) {
        onLoadingCover(false);
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
        onToast({
          isOpened: true,
          severity: "error",
          message: `Error! The week was not updated: ${error.response.data.msg}.`,
        });
        onLoadingCover(false);
        console.error(error);
      }
    } finally {
      setReset(true);
      setWeekName("");
      setWeekStartDate(dayjs(weekInfo.row.weekStartDate));
      setFormError({
        weekNameError: {
          error: false,
          errorMessage: "Please enter a valid name",
        },
        weekStartDateError: {
          error: false,
          errorMessage: "Please enter a valid date",
        },
      });
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
          Edit week:{" "}
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
        onSubmit={handleEditCohortWeekSubmit}
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
                <MenuBook fontSize="large"></MenuBook>
                <br></br>
                <br></br>
              </Box>
              <FormTextField
                required
                value={weekName}
                type="text"
                label="Week name:"
                name="weekName"
                isFocused={true}
                width="100%"
                variant="dark"
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

export default EditCohortWeek;

EditCohortWeek.propTypes = {
  openDialog: PropTypes.bool,
  cohortId: PropTypes.string,
  cohortData: PropTypes.object,
  weekInfo: PropTypes.object,
  onLoadingCover: PropTypes.func,
  onCloseDialog: PropTypes.func,
  onHandleCohortWeeks: PropTypes.func,
  onToast: PropTypes.func,
};

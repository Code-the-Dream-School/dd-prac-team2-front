/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import {
  Avatar,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Typography,
} from "@mui/material";
import {
  BadgeRounded,
  Close,
  DeleteRounded,
  EditRounded,
  Email,
} from "@mui/icons-material";
import useAxiosPrivate from "./../../../hooks/useAxiosPrivate";
import PropTypes from "prop-types";
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React, { useState, useEffect, forwardRef } from "react";
/*
    ==========================
    =         STYLES         =
    ==========================
*/
import styles from "./UpdateProfile.module.css";
/*
    ==========================
    =       COMPONENTS       =
    ==========================
*/
import AppButton from "../../Button/AppButton";
import AuthFormControl from "../../FormControl/AuthFormControl";
import useAuth from "./../../../hooks/useAuth";
import FormTextField from "../../TextField/FormTextField";
import { useLocation, useNavigate } from "react-router-dom";
import ToastMessage from "../../ToastMessage/ToastMessage";

/*
    ==========================
    =          HOOKS         =
    ==========================
*/
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UpdateProfile = ({ open, handleOpenDialog }) => {
  /*
        ==========================
        =          HOOKS         =
        ==========================
    */
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, setAuth } = useAuth();
  /*
        ==========================
        =         STATES        =
        ==========================
    */
  const [formError, setFormError] = useState({
    userNameError: {
      error: false,
      errorMessage: "Please enter a valid name",
    },
    userEmailError: {
      error: false,
      errorMessage: "Please enter a valid e-mail address",
    },
  });
  const [reset, setReset] = useState(false);
  const [toast, setToast] = useState({
    isOpened: false,
    severity: "",
    message: "",
  });
  /*
        ==========================
        =   HANDLER FUNCTIONS    =
        ==========================
    */
  // User name:
  const handleUserNameError = (inputError) => {
    setFormError((prevState) => ({
      ...prevState,
      userNameError: {
        ...prevState.userNameError,
        error: inputError,
      },
    }));
  };

  const handleUserEmailError = (inputError) => {
    setFormError((prevState) => ({
      ...prevState,
      userEmailError: {
        ...prevState.userEmailError,
        error: inputError,
      },
    }));
  };

  const handleNameSubmit = async (event) => {
    event.preventDefault();
    const body = {
      name: event.target.userName.value,
    };
    try {
      if (!formError.userNameError.error) {
        const response = await axiosPrivate.patch("/profile", body);
        setAuth((prevState) => ({
          ...prevState,
          userName: response.data.profile.name,
        }));
        setToast({
          isOpened: true,
          severity: "success",
          message: `Success! Your name has been updated`,
        });
      } else {
        setToast({
          isOpened: true,
          severity: "warning",
          message: `Warning! Please enter valid data into the form fields`,
        });
      }
    } catch (error) {
      if (error.response.status === 403) {
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

  const handleDeleteAccount = async () => {
    try {
      const response = await axiosPrivate.delete("/profile");
      setToast({
        isOpened: true,
        severity: "success",
        message: `Success! Your account has been deleted from MentorUp`,
      });
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
      handleOpenDialog(false);
    } catch (error) {
      if (error.response.status === 403) {
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

  useEffect(() => {
    setReset(false);
  });

  return (
    <>
      <ToastMessage
        open={toast.isOpened}
        severity={toast.severity}
        variant="filled"
        onClose={() =>
          setToast((prevToast) => ({ ...prevToast, isOpened: false }))
        }
        dismissible
        message={toast.message}
      ></ToastMessage>
      <Dialog
      open={open}
      TransitionComponent={Transition}
      onClose={() => handleOpenDialog(false)}
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
          Update profile:{" "}
        </Typography>
        <AppButton
          text={""}
          type="button"
          width="10%"
          handlerFunction={() => handleOpenDialog(false)}
        >
          <Close></Close>
        </AppButton>
      </DialogTitle>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "#C84B31",
        }}
      >
        <DialogContent
          sx={{ width: "100%", height: "auto", paddingX: 0, paddingY: 1 }}
          dividers
        >
          <div className={styles.formContainer}>
            <AuthFormControl width="75%">
              <Avatar
                alt={auth.userName}
                src={auth.avatarUrl ?? "/images/userLarge.png"}
                sx={{ width: 200, height: 200 }}
              />
            </AuthFormControl>
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
              onSubmit={handleNameSubmit}
            >
              <AuthFormControl width="75%">
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <BadgeRounded fontSize="large"></BadgeRounded>
                  <br></br>
                  <br></br>
                </Box>
                <FormTextField
                  required
                  value={auth.userName}
                  type="text"
                  label="Name:"
                  name="userName"
                  isFocused={true}
                  width="100%"
                  variant="dark"
                  regex={/^(?!\s)(.{3,})(?<!\s)$/}
                  onHandleError={handleUserNameError}
                  errorMessage={"Please enter a valid name"}
                  reset={reset}
                ></FormTextField>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <AppButton
                    text={"Update"}
                    type="submit"
                    width="auto"
                    color="#F3950D"
                    handlerFunction={() => {}}
                  >
                    <EditRounded></EditRounded>
                  </AppButton>
                  <br></br>
                  <br></br>
                </Box>
              </AuthFormControl>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                color: "#C84B31",
              }}
              autoComplete="off"
            >
              <AuthFormControl width="75%">
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Email fontSize="large"></Email>
                  <br></br>
                  <br></br>
                </Box>
                <FormTextField
                  required
                  disabled={true}
                  value={auth.userEmail}
                  type="text"
                  label="E-mail:"
                  name="userEmail"
                  isFocused={false}
                  width="100%"
                  variant="dark"
                  regex={/^[^\s@]+@[^\s@]+\.[^\s@]+$/}
                  onHandleError={handleUserEmailError}
                  errorMessage={"Please enter a valid e-mail address"}
                  reset={reset}
                ></FormTextField>
              </AuthFormControl>
            </Box>
          </div>
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
          <AppButton
            text={"Delete account"}
            type="button"
            width="auto"
            color="#CD1818"
            handlerFunction={handleDeleteAccount}
          >
            <DeleteRounded></DeleteRounded>
          </AppButton>
        </DialogActions>
      </Box>
    </Dialog>
    </>
  );
};

export default UpdateProfile;

UpdateProfile.propTypes = {
  open: PropTypes.bool.isRequired,
  handleOpenDialog: PropTypes.func.isRequired,
};

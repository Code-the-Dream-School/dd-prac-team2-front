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
  LockRounded,
} from "@mui/icons-material";
import useAxiosPrivate from "./../../../hooks/useAxiosPrivate";
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

/*
    ==========================
    =          HOOKS         =
    ==========================
*/
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UpdatePassword = ({ open, handleOpenDialog }) => {
  /*
        ==========================
        =          HOOKS         =
        ==========================
    */
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();
  /*
        ==========================
        =         STATES        =
        ==========================
    */
  const [formError, setFormError] = useState({
    passwordError: {
      error: false,
      errorMessage: "Please enter a valid password address.",
    },
  });
  const [reset, setReset] = useState(false);

  /*
        ==========================
        =        HANDLERS        =
        ==========================
    */
  const handlePasswordSubmit = (event) => {
    event.preventDefault();
    const newPassword = event.target.password.value;
    try {
      handleOpenDialog(false);
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

  const handlePasswordError = (inputError) => {
    setFormError((prevState) => ({
      ...prevState,
      passwordError: {
        ...prevState.passwordError,
        error: inputError,
      },
    }));
  };

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={() => handleOpenDialog(false)}
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
            Update password:{" "}
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
          component={"form"}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "#C84B31",
          }}
          autoComplete="off"
          onSubmit={handlePasswordSubmit}
        >
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
                  <LockRounded fontSize="large"></LockRounded>
                  <br></br>
                  <br></br>
                </Box>
                <FormTextField
                  required
                  type="password"
                  label="Password"
                  name="password"
                  isFocused={false}
                  width="100%"
                  variant="dark"
                  regex={/(?=.*[0-9])(?=.{6,})/}
                  errorMessage={
                    "Must be 6 char long and contain at least one number"
                  }
                  onHandleError={handlePasswordError}
                  reset={reset}
                ></FormTextField>
              </AuthFormControl>
            </div>
          </DialogContent>
          <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
            <AppButton
              text={"Update password"}
              type="submit"
              width="auto"
              handlerFunction={() => {}}
            ></AppButton>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default UpdatePassword;

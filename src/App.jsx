/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React, { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { ThemeProvider, createTheme } from "@mui/material";
import axios from "./api/axios";

/*
    ==========================
    =       COMPONENTS       =
    ==========================
*/
import NavigationBar from "./components/NavigationBar/NavigationBar";
import Footer from "./components/Footer/Footer";
import Login from "./pages/Login/Login";
import AdminHome from "./pages/Home/AdminHome";
import RequireAuth from "./components/RequireAuth/RequireAuth";
import Unauthorized from "./pages/Unauthorized/Unauthorized";
import PersistLogin from "./components/PersistLogin/PersistLogin";
import useAuth from "./hooks/useAuth";
import Cohorts from "./pages/Admin/Cohorts/Cohorts";
import Weeks from "./pages/Admin/Weeks/Weeks";
import MentorHome from "./pages/Home/MentorHome";
import StudentHome from "./pages/Home/StudentHome";
import RegisterOnCohort from "./pages/Admin/Users/RegisterOnCohort/RegisterOnCohort";
import RegisterUsers from "./pages/Admin/Users/Register/RegisterUsers";
import AccountConfirmation from "./pages/AccountConfirmation/AccountConfirmation";
import Cohort from "./pages/Mentor/Cohort";
import MentorSessions from "./pages/Mentor/MentorSession/MentorSessions";
import MentorContext from "./pages/Mentor/MentorContext";
import StudentCohort from "./pages/Student/StudentCohort";
import StudentSession from "./pages/Student/StudentSession";
import MentorSessionDetails from "./pages/Mentor/MentorSessionDetails";
import StudentContext from "./pages/Student/StudentContext";
import ToastMessage from "./components/ToastMessage/ToastMessage";
/*
    ==========================
    =    AUX MUI VARIABLES   =
    ==========================
*/
const font = "Montserrat, sans-serif";

const theme = createTheme({
  typography: {
    allVariants: {
      fontFamily: font,
      fontWeight: "bold",
      textTransform: "none",
      fontSize: 16,
    },
  },
});
const App = () => {
  /*
      ==========================
      =        CONTEXT         =
      ==========================
  */
  //1. User auth status:
  const { auth, setAuth } = useAuth();
  const [toast, setToast] = useState({
    isOpened: false,
    severity: "",
    message: "",
  });

  /*
      ==========================
      =        HANDLERS        =
      ==========================
  */
  const handleExpireAuth = async () => {
    try {
      const response = await axios(`auth/logout`, {
        withCredentials: true,
      });
      setToast({
        isOpened: true,
        severity: "success",
        message: `Success! You have signed out of MentorUp`,
      });
      setAuth({
        userId: "",
        slackId: undefined,
        userName: "",
        userEmail: "",
        role: [],
        loggedIn: false,
        avatarUrl: undefined,
        isActive: undefined,
        accessToken: "",
      });
    } catch (error) {
      console.error(error);
    }
  };
  /*
    ==========================
    =    COMPONENT RENDER    =
    ==========================
  */
  return (
    <>
      <header>
        <ThemeProvider theme={theme}>
          <NavigationBar onExpireAuth={handleExpireAuth} />
        </ThemeProvider>
      </header>
      <main>
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
        <br />
        <Routes>
          {/* Public routes */}
          <Route element={<PersistLogin></PersistLogin>}>
            <Route
              path="/login"
              element={
                auth.loggedIn ? (
                  <Navigate to="/"></Navigate>
                ) : (
                  <ThemeProvider theme={theme}>
                    <Login onToast={setToast} />
                  </ThemeProvider>
                )
              }
            />
            <Route
              path="/confirmation"
              element={
                auth.loggedIn ? (
                  <Navigate to="/"></Navigate>
                ) : (
                  <ThemeProvider theme={theme}>
                    <AccountConfirmation onToast={setToast}/>
                  </ThemeProvider>
                )
              }
            />
            <Route
              path="/unauthorized"
              element={
                <ThemeProvider theme={theme}>
                  <Unauthorized />
                </ThemeProvider>
              }
            />
          </Route>
          {/* Admin, Mentor, User shared route based on role. */}
          <Route element={<PersistLogin></PersistLogin>}>
            <Route
              element={
                <RequireAuth
                  allowedRole={["admin", "mentor", "student"]}
                ></RequireAuth>
              }
            >
              <Route
                path="/"
                exact
                element={
                  auth.role.includes("admin") ? (
                    <AdminHome></AdminHome>
                  ) : auth.role.includes("mentor") ? (
                    <Navigate to="/mentor" />
                  ) : auth.role.includes("student") ? (
                    <Navigate to="/student" />
                  ) : null
                }
              />
            </Route>
            <Route
              element={<RequireAuth allowedRole={["admin"]}></RequireAuth>}
            >
              <Route path="/cohorts" exact>
                <Route path="" exact element={<Cohorts></Cohorts>}></Route>
                <Route path=":cohortId" exact element={<Weeks></Weeks>}></Route>
                <Route
                  path="register/:cohortId"
                  exact
                  element={<RegisterOnCohort></RegisterOnCohort>}
                ></Route>
              </Route>
              <Route path="/users" exact>
                <Route
                  path=""
                  exact
                  element={<RegisterUsers></RegisterUsers>}
                ></Route>
              </Route>
            </Route>
            <Route
              element={<RequireAuth allowedRole={["mentor"]}></RequireAuth>}
            >
              <Route element={<MentorContext />}>
                <Route path="mentor" element={<MentorHome />}></Route>
                <Route
                  path="cohort/:cohortId"
                  element={<Cohort></Cohort>}
                ></Route>
                <Route
                  path="mentor/sessions"
                  element={<MentorSessions />}
                ></Route>
                <Route
                  path="mentor/session/:sessionId"
                  element={<MentorSessionDetails />}
                ></Route>
              </Route>
            </Route>
            <Route
              element={<RequireAuth allowedRole={["student"]}></RequireAuth>}
            >
              <Route element={<StudentContext />}>
                <Route path="student" element={<StudentHome />}></Route>
                <Route
                  path="student/cohort/:cohortId"
                  element={<StudentCohort></StudentCohort>}
                ></Route>
                <Route
                  path="student/session/:sessionId"
                  exact
                  element={<StudentSession></StudentSession>}
                ></Route>
              </Route>
            </Route>
          </Route>
        </Routes>
        <br />
      </main>
      <footer>
        <ThemeProvider theme={theme}>
          <Footer></Footer>
        </ThemeProvider>
      </footer>
    </>
  );
};

export default App;

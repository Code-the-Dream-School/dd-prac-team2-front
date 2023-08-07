/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React, { useContext, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { ThemeProvider, createTheme } from '@mui/material';
import axios from './api/axios';

/*
    ==========================
    =       COMPONENTS       =
    ==========================
*/
import NavigationBar from "./components/NavigationBar/NavigationBar";
import Footer from './components/Footer/Footer';
import Login from './pages/Login/Login';
import AdminHome from './pages/Home/AdminHome';
import RequireAuth from './components/RequireAuth/RequireAuth';
import Unauthorized from './pages/Unauthorized/Unauthorized';
import PersistLogin from './components/PersistLogin/PersistLogin';
import useAuth from './hooks/useAuth';
import Cohorts from './pages/Admin/Cohorts/Cohorts';
/*
    ==========================
    =    AUX MUI VARIABLES   =
    ==========================
*/
const font =  "Montserrat, sans-serif";

const theme = createTheme({
  typography: {
    allVariants: {
      fontFamily: font,
      fontWeight: "bold",
      textTransform: "none",
      fontSize: 16,
    }
  }
});
const App = () => {
  /*
      ==========================
      =        CONTEXT         =
      ==========================
  */
  //1. User auth status:
  const {auth, setAuth} = useAuth();

  /*
      ==========================
      =        HANDLERS        =
      ==========================
  */

  const handleExpireAuth = async() => {
    
    try {
      const response = await axios(`auth/logout`, {
        withCredentials: true
      });
      console.log("LOGOUT", response);
      setAuth({
        userName: "",
        loggedUser: {},
        role: "",
        loggedIn: false,
        accessToken: ""
      });
    } catch (error) {
      console.error(error);
    }
    
  }
  /*
    ==========================
    =    COMPONENT RENDER    =
    ==========================
  */
  return (
    <>
        <header>
        <ThemeProvider theme={theme}>
          <NavigationBar onExpireAuth={handleExpireAuth}/>
        </ThemeProvider> 
        </header>
        <main>
          <br/>
          <Routes>
            {/* Public routes */}
            <Route element={<PersistLogin></PersistLogin>}>
              <Route
                path='/login'
                element={
                  auth.loggedIn
                  ? (<Navigate to="/"></Navigate>)
                  : (
                      <ThemeProvider theme={theme}>
                        <Login/>
                      </ThemeProvider>
                    )
                }
              />
              <Route
                path="/unauthorized"
                element={
                  <ThemeProvider theme={theme}>
                    <Unauthorized/>
                  </ThemeProvider>
                }
              />
            </Route>
            {/* Admin, Mentor, User shared route based on role. */}
            <Route element={<PersistLogin></PersistLogin>}>
              <Route element={<RequireAuth allowedRole={"admin"}></RequireAuth>}>
                <Route path="/" exact element={<AdminHome></AdminHome>}></Route>
                <Route path="/cohorts" exact element={<Cohorts></Cohorts>}></Route>
              </Route>
            </Route>
          </Routes>
          <br/>
        </main>
        <footer>
        <ThemeProvider theme={theme}>
          <Footer></Footer>
        </ThemeProvider>
        </footer>
    </>
  );
}

export default App;

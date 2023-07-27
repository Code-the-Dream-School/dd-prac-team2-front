/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React, { useContext, useState } from 'react';
import AuthContext from './context/AuthProvider'
import { Route, Routes } from 'react-router-dom';
/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { ThemeProvider, createTheme } from '@mui/material';

/*
    ==========================
    =       COMPONENTS       =
    ==========================
*/
import NavigationBar from "./components/NavigationBar/NavigationBar";
import Footer from './components/Footer/Footer';
import Login from './pages/Login/Login';
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
  const {auth, setAuth} = useContext(AuthContext);

  /*
      ==========================
      =        HANDLERS        =
      ==========================
  */

  const handleExpireAuth = (authStatus) => {
    setTimeout(()=>{
      console.log("Signed out!");
      setAuth(false);
    }, 2000);
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
          <NavigationBar auth={auth.loggedIn} onExpireAuth={handleExpireAuth}/>
        </ThemeProvider> 
        </header>
        <main>
          <Routes>
            <Route
              path='/'
              exact
              element={
                auth.loggedIn ? (null) : (                  
                  <>
                    <ThemeProvider theme={theme}>
                      <Login/>
                    </ThemeProvider> 
                  </>
                )
              }
            />
          </Routes>
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

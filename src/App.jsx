/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { ThemeProvider, createTheme } from '@mui/material';
import axios from "./api/axios";

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
      =         STATES         =
      ==========================
  */
  //1. User auth status:
  const [auth, setAuth] = useState(false);
  /*
      ==========================
      =        HANDLERS        =
      ==========================
  */

  const handleAuth = (authUser) => {
    if (authUser.email && authUser.password){
      setTimeout(()=>{
        console.log("Authorized!");
        setAuth(true);
      }, 2000);
    }
  }

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
          <NavigationBar auth={auth} onExpireAuth={handleExpireAuth}/>
        </ThemeProvider> 
        </header>
        <main>
          <Routes>
            <Route
              path='/'
              exact
              element={
                auth ? (null) : (                  
                  <>
                    <ThemeProvider theme={theme}>
                      <Login onAuth={handleAuth} />
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

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

/*
    ==========================
    =       COMPONENTS       =
    ==========================
*/
import NavigationBar from "./components/NavigationBar/NavigationBar";
import { ThemeProvider, createTheme } from '@mui/material';
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
      fontSize: 16
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
  const [auth, setAuth] = useState(true);

  /*
    ==========================
    =    COMPONENT RENDER    =
    ==========================
  */
  return (
    <>
        <header>
        <ThemeProvider theme={theme}>
          <NavigationBar auth={auth}/>
        </ThemeProvider> 
        </header>
        <main>
          <Routes>
            <Route
              path='/'
              exact
            />
          </Routes>
        </main>
        <footer>
        </footer>
    </>
  );
}

export default App;

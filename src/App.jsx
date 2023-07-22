/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';

/*
    ==========================
    =       COMPONENTS       =
    ==========================
*/
import NavigationBar from "./components/NavigationBar/NavigationBar";

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
    =    COMPONENT RENDER    =
    ==========================
  */
  return (
    <>
      <header>
        <NavigationBar auth={auth}/>
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

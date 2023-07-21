/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React from 'react';
/*
    ==========================
    =       COMPONENTS       =
    ==========================
*/
import NavigationBar from "./components/NavigationBar/NavigationBar";
import { Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <>
      <header>
        <NavigationBar/>
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

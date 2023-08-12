/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
/* ROBOTO FONT */
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
/* DATE TIME PICKERS */
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
/*
    ==========================
    =       COMPONENTS       =
    ==========================
*/
import App from './App';
import { AuthProvider } from './context/AuthProvider';
/*
    ==========================
    =         STYLES         =
    ==========================
*/
import "./styles.css"
import "animate.css"
/*
    ==========================
    =         UTILS          =
    ==========================
*/
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <AuthProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <App />
            </LocalizationProvider>
        </AuthProvider>
    </BrowserRouter>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

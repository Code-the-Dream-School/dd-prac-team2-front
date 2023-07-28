/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React from 'react'
/*
    ==========================
    =      CUSTOM HOOKS      =
    ==========================
*/
import useRefreshToken from '../../hooks/useRefreshToken';

const AdminHome = () => {
    /*
        ==========================
        =        HANDLERS        =
        ==========================
    */   
    const refresh = useRefreshToken();
    return (
        <button onClick={()=>refresh()}>Refresh</button>
    )
};

export default AdminHome;
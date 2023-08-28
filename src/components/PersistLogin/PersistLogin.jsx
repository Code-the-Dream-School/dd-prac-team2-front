/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
/*
    ==========================
    =      CUSTOM HOOKS      =
    ==========================
*/
import useRefreshToken from "../../hooks/useRefreshToken";
import useAuth from "../../hooks/useAuth";
import Loader from "../Loader/Loader";

const PersistLogin = () => {
  /*
        ==========================
        =         STATES         =
        ==========================
    */
  const [isLoading, setIsLoading] = useState(true);
  /*
        ==========================
        =      CUSTOM HOOKS      =
        ==========================
    */
  const refresh = useRefreshToken();
  const { auth } = useAuth();
  /*
        ==========================
        =        EFFECTS         =
        ==========================
    */
  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
  }, []);

  useEffect(() => {
    console.log(`isLoading: ${isLoading}`);
    console.log(`accessToken: ${auth?.accessToken}`);
    console.log(auth);
  }, [isLoading]);

  return (
    <>
      {isLoading ? (
        // ? <p>Loading...</p>
        <Loader />
      ) : (
        <Outlet></Outlet>
      )}
    </>
  );
};

export default PersistLogin;

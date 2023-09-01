/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React from "react";
import useAuth from "../../hooks/useAuth";

const AdminHome = () => {
  const {auth} = useAuth();
  console.log(auth)
  return null;
};

export default AdminHome;

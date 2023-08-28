/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import AppButton from "../../../../components/Button/AppButton";
import { Container } from "@mui/material";
import {
  ChecklistRounded,
  DeleteRounded,
  EditRounded,
  PeopleAltRounded,
} from "@mui/icons-material";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
/*
    ==========================
    =          HOOKS         =
    ==========================
*/
import useAuth from "../../../../hooks/useAuth";
/*
    ==========================
    =       COMPONENTS       =
    ==========================
*/
import EditCohort from "./EditCohort";
import Loader from "../../../../components/Loader/Loader";

const CohortsActions = ({ params, onHandleCohorts }) => {
  /*
        ==========================
        =          HOOKS         =
        ==========================
    */
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();
  /*
        ==========================
        =         STATES         =
        ==========================
    */
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  /*
        ==========================
        =         HANDLERS       =
        ==========================
    */
  const handleDeleteCohort = async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.delete(`/cohort/${params.row.id}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        onHandleCohorts((prevCohorts) => {
          return prevCohorts.filter((cohort) => cohort.id !== params.row.id);
        });
      }
    } catch (error) {
      if (error.response.status === 403) {
        //User is required to validate auth again
        console.error(error);
        navigate("/login", { state: { from: location }, replace: true });
        setAuth({
          userId: "",
          userName: "",
          userEmail: "",
          role: [],
          loggedIn: false,
          avatarUrl: "",
          isActive: undefined,
          accessToken: "",
        });
      } else {
        console.error(error);
      }
    }
    setLoading(false);
  };

  const handleOpenEditCohort = () => {
    setOpenEditDialog(true);
  };

  const handleCloseEditCohort = () => {
    setOpenEditDialog(false);
  };

  return (
    <>
      {loading ? <Loader /> : null}
      <Container
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "5px",
          "&": { paddingLeft: 0, paddingRight: 0 },
          paddingLeft: 0,
        }}
      >
        <Link to={`${params.row.id}`}>
          <AppButton
            text={"Lessons"}
            type="button"
            width="auto"
            color="#609966"
            handlerFunction={() => {}}
          >
            <ChecklistRounded></ChecklistRounded>
          </AppButton>
        </Link>
        <Link to={`register/${params.row.id}`}>
          <AppButton
            text={"Users"}
            type="button"
            width="auto"
            color="#609966"
            handlerFunction={() => {}}
          >
            <PeopleAltRounded></PeopleAltRounded>
          </AppButton>
        </Link>
        <AppButton
          text={"Edit"}
          type="button"
          width="auto"
          color="#F3950D"
          handlerFunction={() => {
            handleOpenEditCohort();
          }}
        >
          <EditRounded></EditRounded>
        </AppButton>
        <AppButton
          text={"Delete"}
          type="button"
          width="auto"
          color="#CD1818"
          handlerFunction={() => handleDeleteCohort()}
        >
          <DeleteRounded></DeleteRounded>
        </AppButton>
      </Container>
      {openEditDialog ? (
        <EditCohort
          openDialog={openEditDialog}
          cohortInfo={params}
          onCloseDialog={handleCloseEditCohort}
          onHandleCohorts={onHandleCohorts}
        />
      ) : null}
    </>
  );
};

export default CohortsActions;

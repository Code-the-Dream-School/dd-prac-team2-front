/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { Container } from "@mui/material";
import { DeleteRounded, EditRounded } from "@mui/icons-material";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import PropTypes from "prop-types";

/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import AppButton from "../../../../components/Button/AppButton";
import EditCohortWeek from "./EditCohortWeek";
import Loader from "../../../../components/Loader/Loader";

const WeeksActions = ({
  params,
  cohortData,
  loadingCover,
  onLoadingCover,
  cohortId,
  onHandleCohortWeeks,
}) => {
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
  const [openEditDialog, setOpenEditDialog] = useState();

  const handleDeleteCohortWeek = async () => {
    const weekId = params.row.id;
    onLoadingCover(true);
    try {
      const response = await axiosPrivate.delete(`/week/${cohortId}/${weekId}`);
      if (response.status === 204) {
        onHandleCohortWeeks((prevCohortWeeks) =>
          prevCohortWeeks.filter((week) => {
            if (week.id !== weekId) {
              return week;
            }
          })
        );
        onLoadingCover(false);
      }
    } catch (error) {
      if (error.response.status === 403) {
        onLoadingCover(false);
        console.error(error);
        //User is required to validate auth again
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
        onLoadingCover(false);
        console.error(error);
      }
    }
  };

  const handleOpenEditCohortWeek = () => {
    setOpenEditDialog(true);
  };

  const handleCloseEditCohortWeek = () => {
    setOpenEditDialog(false);
  };

  return (
    <>
      <Container
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "5px",
          "&": { paddingLeft: 0, paddingRight: 0 },
          paddingLeft: 0,
        }}
      >
        <AppButton
          text={"Edit"}
          type="button"
          width="auto"
          color="#F3950D"
          handlerFunction={handleOpenEditCohortWeek}
        >
          <EditRounded></EditRounded>
        </AppButton>
        <AppButton
          text={"Delete"}
          type="button"
          width="auto"
          color="#CD1818"
          handlerFunction={handleDeleteCohortWeek}
        >
          <DeleteRounded></DeleteRounded>
        </AppButton>
      </Container>
      {openEditDialog ? (
        <EditCohortWeek
          cohortId={cohortId}
          openDialog={openEditDialog}
          cohortData={cohortData}
          weekInfo={params}
          onLoadingCover={onLoadingCover}
          onCloseDialog={handleCloseEditCohortWeek}
          onHandleCohortWeeks={onHandleCohortWeeks}
        ></EditCohortWeek>
      ) : null}
    </>
  );
};

export default WeeksActions;

WeeksActions.propTypes = {
  params: PropTypes.object,
  cohortData: PropTypes.object,
  loadingCover: PropTypes.bool,
  onLoadingCover: PropTypes.func,
  cohortId: PropTypes.string,
  onHandleCohortWeeks: PropTypes.func,
}

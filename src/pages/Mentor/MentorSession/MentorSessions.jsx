import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { Box, Typography, Container, Chip } from "@mui/material";
import CreateSession from "../CreateSession";
import AppDataGrid from "../../../components/DataGrid/AppDataGrid";
import MentorSessionsTableActions from "./Actions/MentorSessionsActions";
import Loader from "./../../../components/Loader/Loader";
import ToastMessage from "../../../components/ToastMessage/ToastMessage";

function MentorSessions() {
  const axiosPrivate = useAxiosPrivate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCover, setLoadingCover] = useState(false);
  const [toast, setToast] = useState({
    isOpened: false,
    severity: "",
    message: "",
  });

  useEffect(() => {
    const getUpcomingSessions = async () => {
      const res = await axiosPrivate.get("/session/upcoming");
      setSessions(res.data.sessions.map(mapSessionToDataGrid));
      setLoading(false);
    };
    getUpcomingSessions();
  }, [axiosPrivate]);

  const mapSessionToDataGrid = (session) => {
    return {
      id: session._id,
      date: session.start,
      cohort: session.cohortName,
    };
  };

  const updateSessions = (newSessions) => {
    const dataGridSessions = newSessions.map(mapSessionToDataGrid);
    const updatedSessions = sessions.concat(dataGridSessions);
    updatedSessions.sort((a, b) => (a.date > b.date ? 1 : -1));
    setSessions(updatedSessions);
  };

  const removeSession = (sessionId) => {
    const newSessions = sessions.filter((s) => s.id !== sessionId);
    setSessions(newSessions);
  };

  const getFormattedDate = (date) => {
    if (!date) {
      return;
    }
    const auxDate = new Date(date);
    const i = new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZoneName: "short",
    });
    return i.format(auxDate);
  };

  const columns = [
    {
      field: "date",
      headerName: "DATE",
      flex: 4,
      valueFormatter: (params) => getFormattedDate(params.value),
    },
    {
      field: "cohort",
      headerName: "COHORT",
      flex: 1,
      renderCell: (params) => (
        <Chip
          sx={{
            backgroundColor: "#0F3460",
            color: "white",
            fontWeight: "bold",
            textTransform: "capitalize",
          }}
          label={params.value}
        ></Chip>
      ),
    },
    {
      field: "actions",
      headerName: "ACTIONS",
      sortable: false,
      flex: 1,
      renderCell: (row) => (
        <MentorSessionsTableActions
          id={row.id}
          removeSession={removeSession}
          onLoading={setLoadingCover}
          onToast={setToast}
        ></MentorSessionsTableActions>
      ),
    },
  ];

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Container maxWidth="lg">
          <ToastMessage
            open={toast.isOpened}
            severity={toast.severity}
            variant="filled"
            onClose={() =>
              setToast((prevToast) => ({ ...prevToast, isOpened: false }))
            }
            dismissible
            message={toast.message}
          ></ToastMessage>
          <Box
            sx={{
              padding: 4,
              marginBlockEnd: 2,
              backgroundColor: "#1A1A2E",
              borderRadius: 2,
              color: "#FFFFFF",
            }}
          >
            <Typography component="h1" sx={{ fontSize: "2rem" }}>
              Upcoming Sessions
            </Typography>
            <AppDataGrid
              columns={columns}
              rows={sessions}
              fieldToBeSorted="class"
              sortType="asc"
              loading={loadingCover}
            />
          </Box>
          <CreateSession
            updateSessions={updateSessions}
            onLoading={setLoadingCover}
            onToast={setToast}
          />
        </Container>
      )}
    </>
  );
}

export default MentorSessions;

import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { Box, Typography, Container } from "@mui/material";
import CreateSession from "../CreateSession";
import AppDataGrid from "../../../components/DataGrid/AppDataGrid";
import MentorSessionsTableActions from "./Actions/MentorSessionsActions";
import Loader from "./../../../components/Loader/Loader";

function MentorSessions() {
  const axiosPrivate = useAxiosPrivate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCover, setLoadingCover] = useState(false);

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
    };
  };

  const updateSessions = (session) => {
    const dataGridSession = mapSessionToDataGrid(session);
    const newSessions = [...sessions, dataGridSession];
    newSessions.sort((a, b) => (a.date > b.date ? 1 : -1));
    setSessions(newSessions);
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
      field: "actions",
      headerName: "ACTIONS",
      sortable: false,
      flex: 1,
      renderCell: (row) => (
        <MentorSessionsTableActions
          id={row.id}
          removeSession={removeSession}
          onLoading={setLoadingCover}
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
          <CreateSession updateSessions={updateSessions} onLoading={setLoadingCover} />
        </Container>
      )}
    </>
  );
}

export default MentorSessions;

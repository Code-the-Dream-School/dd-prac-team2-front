import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import {
  Box,
  Button,
  Paper,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Typography,
  Container,
} from "@mui/material";
import CreateSession from "../CreateSession";
import AppDataGrid from "../../../components/DataGrid/AppDataGrid";
import AppButton from "../../../components/Button/AppButton";
import { Details, EditRounded } from "@mui/icons-material";
import SessionDetailsRender from "./TableRenders/SessionDetailsRender";

function MentorSessions() {
  const axiosPrivate = useAxiosPrivate();
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const getUpcomingSessions = async () => {
      const res = await axiosPrivate.get("/session/upcoming");

      setSessions(res.data.sessions.map(mapSessionToDataGrid));
    };
    getUpcomingSessions();
  }, [axiosPrivate]);

  const mapSessionToDataGrid = (session) => {
    return {
      id: session._id,
      date: getFormattedDate(session.start),
    };
  };

  const updateSessions = (session) => {
    const newSessions = [...sessions, session];
    newSessions.sort((a, b) => (a.start > b.start ? 1 : -1));
    setSessions(newSessions.slice(0, 6));
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
    { field: "date", headerName: "DATE", flex: 1 },
    {
      field: "actions",
      headerName: "ACTIONS",
      sortable: false,
      renderCell: (row) => (
        <SessionDetailsRender id={row.id}></SessionDetailsRender>
      ),
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          backgroundColor: "#fefefe",
          padding: 4,
          marginBlockEnd: 2,
          bgcolor: "#1A1A2E",
          color: "#FFFFFF",
        }}
      >
        <Typography component="h1" sx={{ fontSize: "2rem" }}>
          Upcoming Sessions
        </Typography>
        {/* {sessions.length > 0 ? (
          sessions.map((session) => (
            <Box key={session._id}>
              <p>{convertDate(session.start)}</p>
            </Box>
          ))
        ) : (
          <p>No sessions awaiting</p>
        )} */}
        {/* <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session._id}>
                  <TableCell>{getFormattedDate(session.start)}</TableCell>
                  <TableCell>
                    <AppButton
                      text="Details"
                      type="button"
                      width="auto"
                      color="#609966"
                      handlerFunction={handleDetails}
                    >
                      <Details />
                    </AppButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer> */}
        <AppDataGrid
          columns={columns}
          rows={sessions}
          fieldToBeSorted="class"
          sortType="asc"
        />
      </Box>

      <CreateSession updateSessions={updateSessions} />
    </Container>
  );
}

export default MentorSessions;

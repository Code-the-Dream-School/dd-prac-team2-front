import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Box } from "@mui/material";
import CreateSession from "./CreateSession";

function MentorSessions() {
    const axiosPrivate = useAxiosPrivate();
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        const getUpcomingSessions = async () => {
            const res = await axiosPrivate.get("/session/upcoming");

            setSessions(res.data.sessions);
        };
        getUpcomingSessions();
    }, [axiosPrivate]);

    const updateSessions = (session) => {
        const newSessions = [...sessions, session];
        newSessions.sort((a, b) => (a.start > b.start ? 1 : -1));
        setSessions(newSessions.slice(0, 6));
    };

    return (
        <>
            <Box
                sx={{
                    backgroundColor: "#fefefe",
                    padding: 4,
                    marginBlockEnd: 2,
                }}
            >
                <h1>Upcoming sessions</h1>
                {sessions.length > 0 ? (
                    sessions.map((session) => (
                        <Box key={session._id}>
                            <p>{session.start}</p>
                        </Box>
                    ))
                ) : (
                    <p>No sessions awaiting</p>
                )}
            </Box>
            <CreateSession updateSessions={updateSessions} />
        </>
    );
}

export default MentorSessions;

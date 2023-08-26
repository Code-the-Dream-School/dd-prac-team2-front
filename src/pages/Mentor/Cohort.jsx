import {
    Box,
    Container,
    Typography,
    List,
    Card,
    CardContent,
    CardActions,
    Button,
    CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const Cohort = () => {
    const [currentWeek, setCurrentWeek] = useState();
    const [loading, setLoading] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    const [cohort] = useOutletContext();

    useEffect(() => {
        const getCurrentWeek = async () => {
            setLoading(true);
            const res = await axiosPrivate.get(`/week/${cohort._id}/current`);
            setCurrentWeek(res.data.currentWeek);
            setLoading(false);
        };
        getCurrentWeek();
    }, []);

    return (
        <Container>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    bgcolor: "transparent",
                }}
            >
                <Typography
                    component={"h1"}
                    sx={{
                        backgroundColor: "#C84B31",
                        borderRadius: 2,
                        padding: 2,
                        margin: 1,
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: 25,
                    }}
                >
                    {cohort.name}
                </Typography>
            </Box>
            <Typography
                sx={{
                    backgroundColor: "#C84B31",
                    borderRadius: 2,
                    padding: 1,
                    margin: 1,
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: 25,
                }}
            >
                {currentWeek?.name}
            </Typography>
            {loading ? (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        paddingBlock: 2,
                    }}
                >
                    <CircularProgress />
                </Box>
            ) : (
                <List>
                    {currentWeek?.sessions?.length > 0 ? (
                        currentWeek?.sessions.map((session) => (
                            <Card
                                key={session._id}
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBlockEnd: 2,
                                }}
                            >
                                <Box>
                                    <CardContent>
                                        <Typography variant="h5">{`${session.type} session`}</Typography>
                                        <Typography variant="subtitle1">
                                            {new Date(
                                                session.start
                                            ).toLocaleDateString()}
                                        </Typography>
                                    </CardContent>
                                </Box>
                                <Box>
                                    <CardContent>
                                        <Typography>{`${session.participant.length} students confirmed`}</Typography>
                                    </CardContent>
                                </Box>
                                <CardActions>
                                    <Button size="small">Details</Button>
                                </CardActions>
                            </Card>
                        ))
                    ) : (
                        <Typography
                            sx={{
                                backgroundColor: "#f2f2f2",
                                padding: 2,
                                borderRadius: 2,
                                textAlign: "center",
                            }}
                        >
                            No sessions scheduled for this week
                        </Typography>
                    )}
                </List>
            )}
        </Container>
    );
};

export default Cohort;

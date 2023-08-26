// Line  136  {new Date(session.start).toLocaleDateString()} ==> change to date and time for example 8/23 8:00 PM
/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import {
  Box,
  Container,
  Typography,
  List,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Chip,
  Stack,
} from '@mui/material';
import { CancelOutlined, CheckCircleOutlineRounded } from '@mui/icons-material';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
/*
    ==========================
    =        COMPONENTS      =
    ==========================
*/
import AppButton from '../../components/Button/AppButton';
import useAuth from '../../hooks/useAuth';

const StudentCohort = () => {
  /*
      ==========================
      =          HOOKS         =
      ==========================
  */
  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth } = useAuth();
  const { state } = useLocation();
  const location = useLocation();
  /*
      ==========================
      =         STATES         =
      ==========================
  */
  const [currentWeek, setCurrentWeek] = useState();
  const [loading, setLoading] = useState(false);
  const cohortId = state._id;
  const navigate = useNavigate();

  /*
      ==========================
      =      AUX FUNCTION      =
      ==========================
  */
  const isUserOnSession = (sessionID) => {
    const sessionToBeChecked = currentWeek.sessions.filter(
      (session) => session._id === sessionID
    );
    if (sessionToBeChecked[0].participant.includes(auth.userId)) {
      return true;
    } else {
      return false;
    }
  };

  /*
      ==========================
      =   HANDLER FUNCTIONS    =
      ==========================
  */
  const getCurrentWeek = async () => {
    setLoading(true);
    const { data } = await axiosPrivate.get(`/week/${cohortId}/current`);
    // console.log(data.currentWeek);
    setCurrentWeek(data.currentWeek);
    setLoading(false);
  };

  const handleConfirmStatus = async (sessionID) => {
    if (!isUserOnSession(sessionID)) {
      setLoading(true);
      try {
        const { data } = await axiosPrivate.patch(
          `/session/${sessionID}/student/updateStatus`,
          {
            status: true,
          }
        );
        setCurrentWeek((prevState) => ({
          ...prevState,
          sessions: prevState.sessions.map((session) => {
            if (session._id === sessionID) {
              return {
                ...session,
                participant: [...session.participant, auth.userId],
              };
            } else {
              return session;
            }
          }),
        }));
        setLoading(false);
      } catch (error) {
        if (error.response.status === 403) {
          setLoading(false);
          //User is required to validate auth again
          navigate('/login', { state: { from: location }, replace: true });
          setAuth({
            userId: '',
            userName: '',
            userEmail: '',
            role: [],
            loggedIn: false,
            avatarUrl: '',
            isActive: undefined,
            accessToken: '',
          });
        } else {
          setLoading(false);
          console.error(error);
        }
      }
    }
  };

  const handleCancelStatus = async (sessionID) => {
    if (isUserOnSession(sessionID)) {
      setLoading(true);
      try {
        await axiosPrivate.patch(`/session/${sessionID}/student/updateStatus`, {
          status: false,
        });
        setCurrentWeek((prevState) => ({
          ...prevState,
          sessions: prevState.sessions.map((session) => {
            if (session._id === sessionID) {
              return {
                ...session,
                participant: session.participant.filter(
                  (participant) => participant !== auth.userId
                ),
              };
            } else {
              return session;
            }
          }),
        }));
        setLoading(false);
      } catch (error) {
        if (error.response.status === 403) {
          setLoading(false);
          //User is required to validate auth again
          navigate('/login', { state: { from: location }, replace: true });
          setAuth({
            userId: '',
            userName: '',
            userEmail: '',
            role: [],
            loggedIn: false,
            avatarUrl: '',
            isActive: undefined,
            accessToken: '',
          });
        } else {
          setLoading(false);
          console.error(error);
        }
      }
    }
  };

  const handleClick = (sessionId) => {
    navigate(`/student/session/${sessionId}`);
  };
  /* 
      ==========================
      =        EFFECTS         =
      ==========================
  */
  useEffect(() => {
    getCurrentWeek();
  }, []);

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          bgcolor: 'transparent',
        }}
      >
        <Typography
          component={'h1'}
          sx={{
            backgroundColor: '#C84B31',
            borderRadius: 2,
            padding: 2,
            margin: 1,
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 25,
          }}
        >
          {state.name}
        </Typography>
      </Box>
      <Typography
        sx={{
          backgroundColor: '#C84B31',
          borderRadius: 2,
          padding: 1,
          margin: 1,
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: 25,
        }}
      >
        {currentWeek?.name}

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
          alignItems="center"
          justifyContent="center"
        >
          <Chip
            variant="outlined"
            label={`Start Date:  ${new Date(
              currentWeek.start
            ).toLocaleDateString()}`}
            sx={{
              '&:hover': {
                backgroundColor: '#C84B31',
                transform: 'scale(1.05)',
                transition: 'all 0.2s ease-in-out',
              },
            }}
          />
          <Chip
            variant="outlined"
            label={`End Date:  ${new Date(
              currentWeek.end
            ).toLocaleDateString()}`}
            sx={{
              '&:hover': {
                backgroundColor: '#C84B31',
                transform: 'scale(1.05)',
                transition: 'all 0.2s ease-in-out',
              },
            }}
          />
        </Stack>
      </Typography>
      {loading ? (
        <Box
          sx={{ display: 'flex', justifyContent: 'center', paddingBlock: 2 }}
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
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '1px',
                }}
              >
                <Box>
                  <CardContent>
                    <Typography
                      onClick={() => handleClick(session._id)}
                      variant="h5"
                    >{`${session.type} session`}</Typography>
                    <Typography variant="subtitle1">
                      {new Date(session.start).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Box>
                <Box>
                  <CardContent>
                    <Typography>{`Host: ${session.creator.name}`}</Typography>
                    <Typography>
                      {`${session.participant.length}`} student confirmed to
                      join
                    </Typography>
                    <Typography></Typography>
                  </CardContent>
                </Box>
                <CardActions>
                  {session.participant.includes(auth.userId) ? (
                    <>
                      <AppButton
                        text={'Yes'}
                        type="button"
                        width="auto"
                        color={'#609966'}
                        handlerFunction={() => handleConfirmStatus(session._id)}
                      >
                        <CheckCircleOutlineRounded></CheckCircleOutlineRounded>
                      </AppButton>
                      <AppButton
                        text={'No'}
                        type="button"
                        width="auto"
                        color={'white'}
                        textColor={'#1A1A2E'}
                        handlerFunction={() => handleCancelStatus(session._id)}
                      >
                        <CancelOutlined></CancelOutlined>
                      </AppButton>
                    </>
                  ) : (
                    <>
                      <AppButton
                        text={'Yes'}
                        type="button"
                        width="auto"
                        color={'white'}
                        textColor={'#1A1A2E'}
                        handlerFunction={() => handleConfirmStatus(session._id)}
                      >
                        <CheckCircleOutlineRounded></CheckCircleOutlineRounded>
                      </AppButton>
                      <AppButton
                        text={'No'}
                        type="button"
                        width="auto"
                        color="#CD1818"
                        handlerFunction={() => handleCancelStatus(session._id)}
                      >
                        <CancelOutlined></CancelOutlined>
                      </AppButton>
                    </>
                  )}
                </CardActions>
              </Card>
            ))
          ) : (
            <Typography
              sx={{
                backgroundColor: '#f2f2f2',
                padding: 2,
                borderRadius: 2,
                textAlign: 'center',
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

export default StudentCohort;

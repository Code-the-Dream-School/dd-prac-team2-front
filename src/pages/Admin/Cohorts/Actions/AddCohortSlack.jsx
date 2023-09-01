import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  Typography,
} from "@mui/material";
import React, { forwardRef, useEffect, useState } from "react";
import AppButton from "../../../../components/Button/AppButton";
import { Close } from "@mui/icons-material";
import Loader from "../../../../components/Loader/Loader";
import CohortsSlackAction from "./CohortsSlackAction";
import AppDataGrid from "../../../../components/DataGrid/AppDataGrid";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../../../hooks/useAuth";
import Slack from "../TableRender/Slack";
/*
      ==========================
      =     AUX VARIABLES      =
      ==========================
  */

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AddCohortSlack = ({ open, handleOpen, onRegisterCohort }) => {
  /*
    ==========================
    =         HOOKS          =
    ==========================
  */
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();
  const [slackChannels, setSlackChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const columns = [
    {
      field: "slackId",
      headerName: "Slack ID",
      minWidth: 120,
      maxWidth: 250,
      flex: 1,
    },
    {
      field: "slack",
      headerName: "Created on:",
      minWidth: 100,
      maxWidth: 100,
      flex: 1,
      valueGetter: (params) => params,
      renderCell: (params) => <Slack params={params}></Slack>,
    },
    {
      field: "name",
      headerName: "Cohort",
      minWidth: 150,
      maxWidth: 150,
      flex: 1,
    },
    {
      field: "type",
      headerName: "Class",
      minWidth: 175,
      maxWidth: 175,
      flex: 1,
    },
    {
      field: "numberOfMembers",
      headerName: "Members",
      minWidth: 70,
      maxWidth: 70,
      flex: 1,
    },
    {
      field: "startDate",
      headerName: "Start date",
      type: "date",
      minWidth: 120,
      maxWidth: 120,
      flex: 1,
    },
    {
      field: "action",
      headerName: "Action",
      sortable: false,
      disableColumnMenu: true,
      flex: 1,
      minWidth: 175,
      maxWidth: 175,
      valueGetter: (params) => params,
      renderCell: (params) => <CohortsSlackAction params={params} onRegisterSlackChannel={setSlackChannels} onRegisterCohort={onRegisterCohort}></CohortsSlackAction>,
    },
  ];

  const fetchSlackChannels = async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get("/slack/channels");
      const channels = response.data.channels.list;
      console.log(channels.map((channel)=>({
        ...channel,
        id: channel.slackId,
        startDate: new Date(channel.startDate),
      })))
      console.log(new Date(channels[0].startDate));
      setSlackChannels(channels.map((channel)=>({
        ...channel,
        id: channel.slackId,
        name: channel.name[0].toUpperCase() + channel.name.slice(1),
        startDate: new Date(channel.startDate),
      })));
      console.log(response);
      setLoading(false);
    } catch (error) {
      console.error(error);
      if (error.response.status === 403) {
        setLoading(false)
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
        setLoading(false)
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchSlackChannels();
  }, []);
  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={() => handleOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          gap={"5px"}
          component={"div"}
        >
          <Typography
            variant="h1"
            textAlign={"center"}
            fontSize={"30px"}
            fontWeight={"bold"}
          >
            Slack channels available:
          </Typography>
          <AppButton
            text={""}
            type="button"
            width="10%"
            handlerFunction={() => handleOpen(false)}
          >
            <Close></Close>
          </AppButton>
        </DialogTitle>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "#C84B31",
          }}
        >
          {loading ? (
            <DialogContent
              sx={{ width: "100%", height: "auto", paddingX: 0, paddingY: 1 }}
              dividers
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "100px",
                }}
              >
                <Loader />
              </Box>
            </DialogContent>
          ) : (
            <DialogContent
              sx={{ width: "90%", height: "auto", paddingX: 1, paddingY: 1 }}
              dividers
            >
              <AppDataGrid
                columns={columns}
                rows={slackChannels}
                fieldToBeSorted={"class"}
                sortType={"asc"}
                variant={"dark"}
              />
            </DialogContent>
          )}
        </Box>
      </Dialog>
    </>
  );
};

export default AddCohortSlack;

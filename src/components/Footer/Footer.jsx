/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import {
  Avatar,
  Chip,
  Divider,
  Link,
  List,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React from "react";
/*
    ==========================
    =         UTILS          =
    ==========================
*/
import { getCurrentYear } from "../../util";

const contributors = [
  {
    name: "Saul Castillo",
    picture: "/images/Saul.jpg",
    url: "https://github.com/secch97",
  },
  {
    name: "Tam Pham",
    picture: "/images/Tam.jpg",
    url: "https://github.com/Miminiverse",
  },
  {
    name: "Carlos Paiva",
    picture: "/images/Carlos.jpg",
    url: "https://github.com/cdpaiva",
  },
  {
    name: "Aleksey K",
    picture: "/images/Aleksey.jpg",
    url: "https://github.com/akabishau",
  },
  {
    name: "Mohamed Mbareck",
    picture: "/images/Mohamed.jpg",
    url: "https://github.com/Mbareck21",
  },
  {
    name: "Dior Shelton",
    picture: "/images/Dior.jpg",
    url: "https://github.com/diorshelton",
  },
  {
    name: "Liubov Rodin",
    picture: "/images/Liubov.png",
    url: "https://github.com/LiubovCass",
  },
];

const Footer = () => {
  return (
    <Paper
      sx={{
        width: "100%",
        bgcolor: "#1A1A2E",
      }}
      elevation={3}
    >
      <Typography
        variant="body1"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        sx={{
          color: "#FFFFFF",
          padding: "5px",
          textAlign: "center",
        }}
      >
        {` COPYRIGHT ${getCurrentYear()} © MENTORUP`}
      </Typography>
      <Divider
        flexItem
        sx={{
          "&::before, &::after": {
            borderColor: "white",
            borderWidth: "1px",
          },
        }}
      >
        <Chip
          label={<Typography>MADE BY</Typography>}
          sx={{ bgcolor: "#C84B31", color: "#FFFFFF" }}
        />
      </Divider>
      <List
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          flexWrap: "wrap",
          paddingBottom: 1,
        }}
      >
        {contributors.map((contributor) => {
          return (
            <Tooltip
              key={contributor.name}
              title={contributor.name}
              placement="bottom"
              sx={{ mx: 1 }}
            >
              <Link href={contributor.url} target="_blank">
                <Avatar
                  alt={contributor.name}
                  src={contributor.picture}
                  sx={{ margin: "2px" }}
                />
              </Link>
            </Tooltip>
          );
        })}
      </List>
    </Paper>
  );
};

export default Footer;
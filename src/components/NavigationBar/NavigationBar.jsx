/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  SwipeableDrawer,
  Toolbar,
  Tooltip,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import {
  CalendarMonth,
  HomeRounded,
  MenuRounded,
  SchoolRounded,
  SupervisedUserCircleRounded,
} from "@mui/icons-material";
import MuiAppBar from "@mui/material/AppBar";
import PropTypes from "prop-types";
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React, { useState } from "react";
import { Link } from "react-router-dom";
/*
    ==========================
    =      CUSTOM HOOKS      =
    ==========================
*/
import useAuth from "../../hooks/useAuth";
/*
    ==========================
    =         STYLES         =
    ==========================
*/
import styles from "./NavigationBar.module.css";
import NavigationBarButton from "../NavigationBar/NavigationBarButton";
import UpdatePassword from "./Actions/UpdatePassword";
import UpdateProfile from "./Actions/UpdateProfile";

const drawerWidth = "auto";

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(0),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...((open || !open) && {
    width: `calc(100% - ${drawerWidth}px)`,
    zIndex: theme.zIndex.drawer + 1, // add this line to increate appBar z-index
    marginTop: "0px",
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));
/*
    ==========================
    =      AUX VARIABLES     =
    ==========================
*/
const adminPages = [
  { title: "Home", icon: <HomeRounded sx={{ color: "white" }} />, link: "/" },
  {
    title: "Cohorts",
    icon: <SchoolRounded sx={{ color: "white" }} />,
    link: "/cohorts",
  },
  {
    title: "Users",
    icon: <SupervisedUserCircleRounded sx={{ color: "white" }} />,
    link: "/users",
  },
];

const studentPages = [
  { title: "Home", icon: <HomeRounded sx={{ color: "white" }} />, link: "/" },
];

const mentorPages = [
  {
    title: "Home",
    icon: <HomeRounded sx={{ color: "white" }} />,
    link: "/mentor",
  },
  {
    title: "Sessions",
    icon: <SchoolRounded sx={{ color: "white" }} />,
    link: "/mentor/sessions",
  },
];

const settings = ["Update profile", "Update password", "Sign out"];

const NavigationBar = ({ onExpireAuth }) => {
  /*
    ==========================
    =         CONTEXT        =
    ==========================
  */
  const { auth } = useAuth();
  /*
    ==========================
    =         STATES         =
    ==========================
  */
  //1. State used for nav-bar hamburguer menu position:
  const [anchorNav, setAnchorNav] = useState(false);
  //2. State used for user settings position:
  const [anchorElUser, setAnchorElUser] = useState(null);
  //3. State used to open profile dialog:
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  /*
    ==========================
    =        HANDLERS        =
    ==========================
  */
  //1. Handler for opening the nav-bar hamburguer menu.
  const handleDrawerToggling = (open, event) => {
    //If the user moves the selected list item using the tab key or enters a list item using enter key: do not close the drawer.
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setAnchorNav(open);
  };
  //2. Handler for opening the user settings menu.
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  //3. Handler for closing the user settings menu.
  const handleCloseUserMenu = (event, setting) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    if (setting === "Sign out") {
      setAnchorNav(false);
      setAnchorElUser(null);
      onExpireAuth();
    } else if (setting === "Update profile") {
      setOpenProfileDialog(true);
      setAnchorElUser(null);
    } else if (setting === "Update password") {
      setOpenPasswordDialog(true);
      setAnchorElUser(null);
    } else {
      setAnchorElUser(null);
    }
  };
  /*
    ==========================
    =    COMPONENT RENDER    =
    ==========================
  */
  return (
    <>
      <AppBar position="fixed" sx={{ bgcolor: "#1A1A2E" }} open={anchorNav}>
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              display: "flex",
              justifyContent: auth
                ? "space-between"
                : { xs: "center", md: "space-between" },
            }}
          >
            {auth.loggedIn && (
              <Box sx={{ display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="Menu options for current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={(event) =>
                    anchorNav
                      ? handleDrawerToggling(false, event)
                      : handleDrawerToggling(true, event)
                  }
                  color="inherit"
                >
                  <MenuRounded />
                </IconButton>
              </Box>
            )}
            <Box
              sx={{
                display: { xs: "flex", md: "flex" },
                justifySelf: "center",
              }}
            >
              <Link to="/" className={styles.mentorUpLogoLink}>
                <img className={styles.mentorUpLogo} src="/images/logo.png" />
              </Link>
            </Box>
            {auth.loggedIn && (
              <>
                <Box
                  sx={{
                    flexGrow: 1,
                    display: { xs: "none", md: "flex" },
                    justifyContent: "flex-start",
                  }}
                >
                  {auth.role.includes("admin")
                    ? adminPages.map((page) => {
                        return (
                          <Link key={page.title} to={page.link}>
                            <NavigationBarButton
                              text={page.title}
                              iconComponent={page.icon}
                              onDrawerToggling={(event) =>
                                handleDrawerToggling(false, event)
                              }
                            />
                          </Link>
                        );
                      })
                    : auth.role.includes("mentor")
                    ? mentorPages.map((page) => {
                        return (
                          <Link key={page.title} to={page.link}>
                            <NavigationBarButton
                              text={page.title}
                              iconComponent={page.icon}
                              onDrawerToggling={(event) =>
                                handleDrawerToggling(false, event)
                              }
                            />
                          </Link>
                        );
                      })
                    : auth.role.includes("student")
                    ? studentPages.map((page) => {
                        return (
                          <Link key={page.title} to={page.link}>
                            <NavigationBarButton
                              text={page.title}
                              iconComponent={page.icon}
                              onDrawerToggling={(event) =>
                                handleDrawerToggling(false, event)
                              }
                            />
                          </Link>
                        );
                      })
                    : null}
                </Box>
                <Box sx={{ flexGrow: 0 }}>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar
                        alt="User profile picture"
                        src={auth.avatarUrl ?? "/images/user.png"}
                      />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{
                      mt: "45px",
                      "& .MuiMenu-paper": {
                        bgcolor: "#16213E",
                        color: "white",
                        "& .MuiMenuItem-root:hover": {
                          bgcolor: "#C84B31",
                        },
                      },
                      "& .MuiList-root": {
                        py: "0px",
                      },
                    }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    keepMounted
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    {settings.map((setting) => {
                      return (
                        <MenuItem
                          key={setting}
                          onClick={(event) =>
                            handleCloseUserMenu(event, setting)
                          }
                        >
                          <Typography textAlign="center">{setting}</Typography>
                        </MenuItem>
                      );
                    })}
                  </Menu>
                </Box>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <SwipeableDrawer
        sx={{
          display: { xs: "float", md: "none" },
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        anchor="top"
        open={anchorNav}
        onClose={(event) => handleDrawerToggling(false, event)}
        onOpen={(event) => handleDrawerToggling(true, event)}
      >
        <DrawerHeader />
        <Box
          role="presentation"
          onClick={(event) => handleDrawerToggling(false, event)}
          onKeyDown={(event) => handleDrawerToggling(false, event)}
          sx={{ bgcolor: "#16213E" }}
        >
          <List
            sx={{
              // hover states
              "& .MuiListItemButton-root:hover": {
                bgcolor: "#C84B31",
                "&, & .MuiListItemIcon-root": {
                  color: "#ECDBBA",
                },
              },
              "& .MuiListItemButton-root:focus": {
                bgcolor: "#C84B31",
              },
              paddingBottom: "0px",
            }}
          >
            {auth.role.includes("admin")
              ? adminPages.map((page) => {
                  return (
                    <Link key={page.title} to={page.link}>
                      <ListItem key={page.title} disablePadding>
                        <ListItemButton>
                          <ListItemIcon>{page.icon}</ListItemIcon>
                          <ListItemText
                            sx={{ color: "#FFFFFF" }}
                            primary={page.title}
                          />
                        </ListItemButton>
                      </ListItem>
                    </Link>
                  );
                })
              : auth.role.includes("mentor")
              ? mentorPages.map((page) => {
                  return (
                    <Link key={page.title} to={page.link}>
                      <ListItem key={page.title} disablePadding>
                        <ListItemButton>
                          <ListItemIcon>{page.icon}</ListItemIcon>
                          <ListItemText
                            sx={{ color: "#FFFFFF" }}
                            primary={page.title}
                          />
                        </ListItemButton>
                      </ListItem>
                    </Link>
                  );
                })
              : auth.role.includes("student")
              ? studentPages.map((page) => {
                  return (
                    <Link key={page.title} to={page.link}>
                      <ListItem key={page.title} disablePadding>
                        <ListItemButton>
                          <ListItemIcon>{page.icon}</ListItemIcon>
                          <ListItemText
                            sx={{ color: "#FFFFFF" }}
                            primary={page.title}
                          />
                        </ListItemButton>
                      </ListItem>
                    </Link>
                  );
                })
              : null}
          </List>
        </Box>
      </SwipeableDrawer>
      {openProfileDialog ? (
        <UpdateProfile
          open={openProfileDialog}
          handleOpenDialog={setOpenProfileDialog}
        ></UpdateProfile>
      ) : null}
      {openPasswordDialog ? (
        <UpdatePassword
          open={openPasswordDialog}
          handleOpenDialog={setOpenPasswordDialog}
        ></UpdatePassword>
      ) : null}
    </>
  );
};

export default NavigationBar;

NavigationBar.propTypes = {
  onExpireAuth: PropTypes.func.isRequired,
};

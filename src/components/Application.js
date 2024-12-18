import {
  AccountCircle,
  Close as CloseIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Badge,
  CssBaseline,
  Divider,
  Drawer,
  Fade,
  Grid,
  Hidden,
  IconButton,
  Link,
  Snackbar,
  Toolbar,
  Typography,
  keyframes,
} from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { styled, useTheme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { FaUserEdit } from "react-icons/fa";
import { GoSignOut } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import theme from "../theme";
import EditProfile from "./EditProfile";
import Rooms from "./Rooms";

const drawerWidth = 240;

const ripple = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2.4);
    opacity: 0;
  }
`;

const StyledBadge = styled(Badge)(({ theme }) => ({
  badge: {
    backgroundColor: "#44b700 !important",
    color: "#44b700 !important",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper} !important`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100px !important",
      height: "100px !important",
      borderRadius: "50% !important",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes": {
    ripple,
  },
}));

const useStyles = makeStyles({
  root: {
    display: "flex",
  },
  avatarGrid: {
    paddingTop: "20px !important",
    paddingLeft: "5px !important",
    paddingBottom: "20px !important",
    color: "#dcddde !important",
  },
  avatarIcon: {
    display: "flex !important",
    paddingLeft: "10px !important",
    paddingRight: "10px !important",
  },
  avatarDisplayData: {
    fontSize: "1em !important",
    paddingLeft: "12px !important",
    paddingTop: "8px !important",
  },
  avatarDisplayName: {
    alignSelf: "center !important",
    paddingLeft: "10px !important",
    fontWeight: "600 !important",
  },
  purple: {
    color: "#673ab7 !important",
    backgroundColor: "#3f51b5 !important",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px) !important`,
      marginLeft: `${drawerWidth} !important`,
    },
    backgroundColor: "#22273b !important",
    color: "#dcddde",
    boxShadow:
      "0 1px 0 rgba(4,4,5,0.2),0 1.5px 0 rgba(6,6,7,0.05),0 2px 0 rgba(4,4,5,0.05); !important",
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none !important",
    },
  },
  toolbar: `${theme.mixins.toolbar} !important`,
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: "#171c2e !important",
    color: "white !important",
  },
  sideToolBar: {
    backgroundColor: "#171c2e !important",
    color: "#fff !important",
    lineHeight: 1.6,
    boxShadow:
      "0 1px 0 rgba(4,4,5,0.2),0 1.5px 0 rgba(6,6,7,0.05),0 2px 0 rgba(4,4,5,0.05); !important",
    minHeight: "2.2rem !important",
  },
  sideToolBarText: {
    letterSpacing: "0.2em !important",
    fontWeight: "900 !important",
  },
  title: {
    flexGrow: 1,
  },
});

const Application = ({ window }) => {
  const classes = useStyles();
  const theme = useTheme();
  const navigate = useNavigate();
  const [alert, setAlert] = useState(false);
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDetails, setUserDetails] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    onAuthStateChanged(
      auth,
      async (user) => {
        if (user) {
          setUserDetails(user.toJSON());
        } else {
          setUserDetails(null);
        }
      },
      (err) => {
        console.log(err.message);
      }
    );
  }, []);

  const handleAlert = () => {
    setAlert(!alert);
  };

  const toggleEditProfile = () => {
    setEditProfileModal(!editProfileModal);
    setAnchorEl(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const signOutHandler = () => {
    signOut(auth)
      .then(() => {
        console.log("Signout Successfully");
        localStorage.clear();
        navigate("/");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const drawer = userDetails && (
    <div className={classes.sideToolBar}>
      <Toolbar>
        <Typography variant="h6" className={classes.sideToolBarText}>
          CHATIFY
        </Typography>
      </Toolbar>
      <Divider />
      <Grid className={classes.avatarGrid}>
        <div className={classes.avatarIcon}>
          <StyledBadge
            overlap="circle"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            variant="dot"
          >
            <Avatar
              alt={userDetails.name}
              src={userDetails.photoURL}
              className={classes.purple}
            />
          </StyledBadge>
          <Typography component={"h6"} className={classes.avatarDisplayName}>
            {userDetails.displayName}
          </Typography>
        </div>
        <div>
          <Typography variant="h4" className={classes.avatarDisplayData}>
            {userDetails.name}
          </Typography>
          <Typography variant="h4" className={classes.avatarDisplayData}>
            {userDetails.email}
          </Typography>
        </div>
      </Grid>
      <Divider />
      <Rooms />
      <Divider />
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={alert}
        onClose={handleAlert}
        TransitionComponent={Fade}
        message="Display name updated successfully"
        key={Fade}
        action={
          <IconButton aria-label="close" color="inherit" onClick={handleAlert}>
            <CloseIcon />
          </IconButton>
        }
      />
      {editProfileModal ? (
        <EditProfile
          toggler={toggleEditProfile}
          alert={handleAlert}
          userDetails={userDetails}
        />
      ) : null}
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar style={{ minHeight: "50px" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            <Link to="/" style={{ textDecoration: "none", color: "#dcddde" }}>
              Home
            </Link>
          </Typography>
          <div>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={toggleEditProfile}>
                <FaUserEdit /> &nbsp; Edit Profile
              </MenuItem>
              <MenuItem onClick={signOutHandler}>
                <GoSignOut /> &nbsp; Sign out
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="chat-rooms">
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );
};

export default Application;

import {
  Add as AddIcon,
  Close as CloseIcon,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import {
  Collapse,
  Divider,
  Fade,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  styled,
} from "@mui/material";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { BiHash } from "react-icons/bi";
import { IoMdChatboxes } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import CreateRoom from "./CreateRoom";

const useStyles = {
  nested: styled("div")(({ theme }) => ({
    paddingLeft: theme.spacing(4),
  })),
  iconDesign: styled("div")({
    fontSize: "1.5em",
    color: "#cb43fc",
  }),
  primary: styled("div")({
    color: "#cb43fc",
  }),
};

const Rooms = () => {
  const classes = useStyles;
  const navigate = useNavigate();
  const [alert, setAlert] = useState(false);
  const [open, setOpen] = React.useState(true);
  const [channelList, setChannelList] = useState([]);
  const [showCreateRoom, setShowCreateRoom] = useState(false);

  useEffect(() => {
    onSnapshot(collection(db, "channels"), (snapshot) => {
      setChannelList(
        snapshot.docs.map((channel) => ({
          channelName: channel.data().channelName,
          id: channel.id,
        }))
      );
    });
  }, []);

  const handleClick = () => {
    setOpen(!open);
  };

  const goToChannel = (id) => {
    navigate(`/channel/${id}`);
  };

  const handleAlert = () => {
    setAlert(!alert);
  };

  const manageCreateRoomModal = () => {
    setShowCreateRoom(!showCreateRoom);
  };

  const addChannel = (cName) => {
    try {
      if (cName) {
        cName = cName.toLowerCase().trim();
        if (cName === "") {
          console.log("Room name must not empty");
          return;
        }
      }

      for (var i = 0; i < channelList.length; i++) {
        if (cName === channelList[i].channelName) {
          console.log("Channel name already taken change its subject");
          return;
        }
      }

      addDoc(collection(db, "channels"), {
        channelName: cName.toLowerCase(),
      });
    } catch (error) {
      console.log("Error while creating new room", error);
    }
  };

  return (
    <div className={classes.root}>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={alert}
        onClose={handleAlert}
        TransitionComponent={Fade}
        message="Room name already exists!"
        key={Fade}
        action={
          <IconButton aria-label="close" color="inherit" onClick={handleAlert}>
            <CloseIcon />
          </IconButton>
        }
      />
      {showCreateRoom ? (
        <CreateRoom create={addChannel} manage={manageCreateRoomModal} />
      ) : null}
      <ListItem style={{ paddingTop: 0, paddingBottom: 0 }}>
        <ListItemText primary="Create New Channel" />
        <IconButton edge="end" aria-label="add" onClick={manageCreateRoomModal}>
          <AddIcon className={classes.primary} />
        </IconButton>
      </ListItem>
      <Divider />
      <List component="nav" aria-labelledby="nested-list-subheader">
        <ListItem button onClick={handleClick}>
          <ListItemIcon>
            <IoMdChatboxes className={classes.iconDesign} />
          </ListItemIcon>
          <ListItemText primary="CHANNELS" style={{ color: "#8e9297" }} />
          {open ? (
            <ExpandLess className={classes.primary} />
          ) : (
            <ExpandMore className={classes.primary} />
          )}
        </ListItem>
        <Collapse in={open} timeout="auto">
          <List component={"div"} disablePadding>
            {channelList.map((channel) => (
              <ListItem
                key={channel.id}
                button
                className={classes.nested}
                onClick={() => goToChannel(channel.id)}
              >
                <ListItemIcon style={{ minWidth: "30px" }}>
                  <BiHash
                    className={classes.iconDesign}
                    style={{ color: "#b9bbbe" }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    channel.channelName === channel.channelName.substr(0, 12)
                      ? channel.channelName
                      : `${channel.channelName.substr(0, 12)}...`
                  }
                  style={{ color: "#dcddde" }}
                />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </List>
    </div>
  );
};

export default Rooms;

import { Avatar, Grid, IconButton } from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import { makeStyles } from "@mui/styles";
import {
  deleteDoc,
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import React from "react";
import { Anchorme } from "react-anchorme";
import {
  AiFillDelete,
  AiFillFire,
  AiFillHeart,
  AiFillLike,
} from "react-icons/ai";
import { useParams } from "react-router-dom";
import { db } from "../firebase/firebase";
import DeleteModal from "./DeleteModal";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    position: "relative",
    padding: "8px",
  },
  paper: {
    padding: "10px",
    "&:hover": {
      backgroundColor: "#1f2436",
    },
  },
  avatar: {
    display: "inline-block",
    verticalAlign: "top",
  },
  chat: {
    display: "inline-block",
    paddingLeft: "1rem",
    width: "calc(100% - 50px)",
    wordBreak: "break-all",
  },
  chatHeading: {
    marginBlockStart: 0,
    marginBlockEnd: 0,
    display: "inline-block",
    fontSize: "1rem",
    fontWeight: "600",
    color: "white",
  },
  chatTiming: {
    marginBlockStart: 0,
    marginBlockEnd: 0,
    display: "inline-block",
    paddingLeft: "0.5em",
    color: "white",
  },
  chatText: {
    color: "#dcddde",
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: "#3f51b5",
  },
  emojiDiv: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  emojiDivInner: {
    position: "absolute",
    right: 0,
    padding: "0 35px 0 32px",
  },
  emojiBtn: {
    fontSize: "1.1rem",
    color: "rgb(255 195 54)",
  },
  allEmoji: {
    backgroundColor: "#2d2e31ba",
    borderRadius: "5px",
    paddingLeft: "2px",
    paddingRight: "2px",
    display: "flex",
  },
  countEmojiBtn: {
    padding: "3px",
    borderRadius: "4px",
    fontSize: "0.8em",
    backgroundColor: "#ffffff4a",
    color: "#cacaca",
    paddingLeft: "5px",
    paddingRight: "5px",
    "&:hover": {
      backgroundColor: "#ffffff4a",
      color: "#e7e7e7",
    },
  },
}));

const Message = ({ values, msgId }) => {
  const classes = useStyles();
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [style, setStyle] = React.useState({ display: "none" });
  const uid = JSON.parse(localStorage.getItem("userDetails")).uid;
  const messageUid = values.uid;
  const date = values.timestamp.toDate();
  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.getMonth();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const time = `${day}/${month}/${year} ${hour}:${minute}`;
  const numLikes = values.likeCount;
  const numFire = values.fireCount;
  const numHeart = values.hearCount;
  const userLiked = values.likes[uid];
  const userFire = values.fire[uid];
  const userHeart = values.heart[uid];
  const postImg = values.postImg;
  const channelId = useParams().id;
  const selectLike = userLiked
    ? { color: "#8ff870", backgroundColor: "#545454" }
    : null;
  const selectFire = userFire
    ? { color: "#ffc336", backgroundColor: "#545454" }
    : null;
  const selectHeart = userHeart
    ? { color: "#ff527d", backgroundColor: "#545454" }
    : null;

  const showDeleteModal = () => {
    setDeleteModal(!deleteModal);
  };

  const deleteMsg = async (messageId) => {
    try {
      const messageDocRef = doc(
        db,
        "channels",
        channelId,
        "messages",
        messageId
      );
      await deleteDoc(messageDocRef);
      console.log("Message deleted successfully");
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const likeClick = async () => {
    const messageDocRef = doc(db, "channels", channelId, "messages", msgId);

    try {
      await runTransaction(db, async (transaction) => {
        const messageDoc = await getDoc(messageDocRef);

        if (!messageDoc.exists()) {
          console.log("Document not found");
          return;
        }

        const currentLikeCount = messageDoc.data().likeCount;
        const currentLike = messageDoc.data().likes || {};
        const newLike = { ...currentLike };

        if (userLiked) {
          newLike[uid] = false;
        } else {
          newLike[uid] = true;
        }

        const newLikeCount = userLiked
          ? currentLikeCount - 1
          : currentLikeCount + 1;

        transaction.update(messageDocRef, {
          likeCount: newLikeCount,
          likes: newLike,
          updatedAt: serverTimestamp(),
        });
      });

      console.log(userLiked ? "Disliked" : "Liked");
    } catch (error) {
      console.error("Error toggling Like: ", error);
    }
  };

  const fireClick = async () => {
    const messageDocRef = doc(db, "channels", channelId, "messages", msgId);

    try {
      await runTransaction(db, async (transaction) => {
        const messageDoc = await getDoc(messageDocRef);

        if (!messageDoc.exists()) {
          console.log("Document not found");
          return;
        }

        const currentFireCount = messageDoc.data().fireCount;
        const currentFire = messageDoc.data().fires || {};
        const newFire = { ...currentFire };

        if (userFire) {
          newFire[uid] = false;
        } else {
          newFire[uid] = true;
        }

        const newFireCount = userFire
          ? currentFireCount - 1
          : currentFireCount + 1;

        transaction.update(messageDocRef, {
          fireCount: newFireCount,
          fires: newFire,
          updatedAt: serverTimestamp(),
        });
      });

      console.log(userFire ? "Fired down" : "Fired up");
    } catch (error) {
      console.error("Error toggling Fire: ", error);
    }
  };

  const heartClick = async () => {
    const messageDocRef = doc(db, "channels", channelId, "messages", msgId);

    try {
      await runTransaction(db, async (transaction) => {
        const messageDoc = await getDoc(messageDocRef);

        if (!messageDoc.exists()) {
          console.log("Document not found");
          return;
        }

        const currentHeartCount = messageDoc.data().heartCount;
        const currentHeart = messageDoc.data().hearts || {};
        const newHeart = { ...currentHeart };

        if (userHeart) {
          newHeart[uid] = false;
        } else {
          newHeart[uid] = true;
        }

        const newHeartCount = userHeart
          ? currentHeartCount - 1
          : currentHeartCount + 1;

        transaction.update(messageDocRef, {
          heartCount: newHeartCount,
          hearts: newHeart,
          updatedAt: serverTimestamp(),
        });
      });

      console.log(userHeart ? "Heart down" : "Heart up");
    } catch (error) {
      console.error("Error toggling Heart: ", error);
    }
  };

  return (
    <Grid item xs={12} className={classes.root}>
      {deleteModal ? (
        <DeleteModal
          msgId={msgId}
          text={values.text}
          postImg={postImg}
          deleteMsg={deleteMsg}
          handleModal={showDeleteModal}
        />
      ) : null}
      <div
        className={classes.paper}
        onMouseEnter={(e) => setStyle({ display: "block" })}
        onMouseLeave={(e) => {
          setStyle({ display: "none" });
        }}
      >
        <div className={classes.avatar}>
          <Avatar
            alt={values.userName}
            src={values.userImg}
            className={classes.purple}
          />
        </div>
        <div className={classes.chat}>
          <div>
            <h6 className={classes.chatHeading}>{values.userName}</h6>
            <p className={classes.chatTiming}>{time}</p>
          </div>
          <div className={classes.chatText}>
            {values.text.split("\n").map((txt, idx) => (
              <div key={idx}>
                <Anchorme target="_blank" rel="noreferrer noopener">
                  {txt}
                </Anchorme>
              </div>
            ))}
          </div>
          <Grid item xs={12} md={12} style={{ paddingTop: "5px" }}>
            {values.postImg ? (
              <img
                src={values.postImg}
                alt="user"
                style={{ height: "30vh", width: "auto", borderRadius: "4px" }}
              />
            ) : null}
          </Grid>
          <div style={{ paddingTop: "5px", display: "flex" }}>
            {numLikes > 0 ? (
              <div style={{ padding: "3px" }}>
                <IconButton
                  component="span"
                  onClick={likeClick}
                  className={classes.countEmojiBtn}
                  style={selectLike}
                >
                  <AiFillLike size={12} />
                  <div style={{ paddingLeft: "2px", fontSize: "14px" }}>
                    {numLikes}
                  </div>
                </IconButton>
              </div>
            ) : null}
            {numFire > 0 ? (
              <div style={{ padding: "3px" }}>
                <IconButton
                  component="span"
                  onClick={fireClick}
                  className={classes.countEmojiBtn}
                  style={selectFire}
                >
                  <AiFillFire size={12} />
                  <div style={{ paddingLeft: "2px", fontSize: "14px" }}>
                    {numFire}
                  </div>
                </IconButton>
              </div>
            ) : null}
            {numHeart > 0 ? (
              <div style={{ padding: "3px" }}>
                <IconButton
                  component="span"
                  onClick={heartClick}
                  className={classes.countEmojiBtn}
                  style={selectHeart}
                >
                  <AiFillHeart size={12} />
                  <div style={{ paddingLeft: "2px", fontSize: "14px" }}>
                    {numHeart}
                  </div>
                </IconButton>
              </div>
            ) : null}
          </div>
        </div>
        <div className={classes.emojiDiv} style={style}>
          <div className={classes.emojiDivInner}>
            <div className={classes.allEmoji}>
              <IconButton
                component="span"
                style={{ padding: "4px" }}
                onClick={likeClick}
              >
                <AiFillLike className={classes.emojiBtn} />
              </IconButton>
              <IconButton
                component="span"
                style={{ padding: "4px" }}
                onClick={fireClick}
              >
                <AiFillFire className={classes.emojiBtn} />
              </IconButton>
              <IconButton
                component="span"
                style={{ padding: "4px" }}
                onClick={heartClick}
              >
                <AiFillHeart className={classes.emojiBtn} />
              </IconButton>
              {uid === messageUid && (
                <IconButton
                  component="span"
                  style={{
                    padding: "4px",
                  }}
                  onClick={showDeleteModal}
                >
                  <AiFillDelete
                    className={classes.emojiBtn}
                    color="#c3c3c3f0"
                  />
                </IconButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </Grid>
  );
};

export default Message;

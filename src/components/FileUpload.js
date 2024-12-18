import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { db, storage } from "../firebase/firebase";

const useStyles = makeStyles((theme) => ({
  displayImage: {
    height: "105px",
    width: "180px",
  },
  imageName: {
    paddingLeft: "15px",
    fontSize: "1.3em",
  },
  imageDiv: {
    marginLeft: "16px",
    marginRight: "16px",
    marginTop: "-33px",
  },
}));

const FileUpload = ({ setState, file }) => {
  const params = useParams();
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [progress, setProgress] = useState(0);
  const [progressBar, setProgressBar] = useState({ display: "none" });
  const [message, setMessage] = useState("");

  const handleClose = () => {
    setOpen(false);
    setState();
  };

  const sendMsg = async (downloadURL) => {
    if (params.id) {
      const userData = JSON.parse(localStorage.getItem("userDetails"));

      if (userData) {
        const displayName = userData.displayName;
        const imgUrl = userData.photoURL;
        const uid = userData.uid;
        const likeCount = 0;
        const likes = {};
        const fireCount = 0;
        const fire = {};
        const heartCount = 0;
        const heart = {};
        const postImg = downloadURL;
        const obj = {
          text: message,
          timestamp: Timestamp.now(),
          userImg: imgUrl,
          userName: displayName,
          uid: uid,
          likeCount: likeCount,
          likes: likes,
          fireCount: fireCount,
          fire: fire,
          heartCount: heartCount,
          heart: heart,
          postImg: postImg,
        };
        console.log(userData);

        try {
          const messageRef = collection(db, "channels", params.id, "messages");
          await addDoc(messageRef, obj);
        } catch (error) {
          console.error("Not send");
        }
      }
      setMessage("");
    }
  };

  const fileObj = URL.createObjectURL(file);

  const handleUpload = (e) => {
    e.preventDefault();
    setProgressBar({ display: "block" });

    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          sendMsg(downloadURL);
          console.log("File available at", downloadURL);
        });
        handleClose();
      }
    );
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className={classes.imageDiv}>
          <img src={fileObj} alt={file.name} className={classes.displayImage} />
          <Typography className={classes.imageName}>{file.name}</Typography>
        </div>
        <DialogTitle id="alert-dialog-title">Upload Image</DialogTitle>
        <DialogContent>
          <form
            autoComplete="off"
            onSubmit={(e) => {
              handleUpload(e);
            }}
          >
            <TextField
              id="outlined-basic"
              label="Add a message"
              fullWidth
              margin="normal"
              variant="outlined"
              style={{
                backgroundColor: "rgb(45, 45, 73)",
                borderRadius: "5px",
              }}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
          </form>
          <div style={progressBar}>
            <Box display="flex" alignItems="center">
              <Box width="100%" mr={1}>
                <LinearProgress variant="determinate" value={progress} />
              </Box>
              <Box minWidth={35}>
                <Typography variant="body2">{Math.round(progress)}%</Typography>
              </Box>
            </Box>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} style={{ color: "white" }}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={(e) => handleUpload(e)}
            color="primary"
            autoFocus
            variant="contained"
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FileUpload;

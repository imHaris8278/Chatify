import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase/firebase";

const EditProfile = ({ toggler, alert, userDetails }) => {
  const [open, setOpen] = useState(true);
  const [displayName, setDisplayName] = useState("");

  const handleClose = () => {
    setOpen(false);
    toggler();
  };

  const updateProfileHandler = (e) => {
    e.preventDefault();

    updateProfile(auth.currentUser, {
      displayName: displayName,
      email: userDetails.email,
    }).then((res) => {
      alert();
      window.location.reload();
    });

    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Edit User Profile</DialogTitle>
        <DialogContent>
          <form autoComplete="off">
            <TextField
              id="outlined-basic"
              label="Name"
              fullWidth
              margin="normal"
              variant="outlined"
              disabled
              value={userDetails.displayName}
              style={{
                backgroundColor: "rgb(45,45,73)",
                borderRadius: "5px",
                color: "#a6a6a6",
              }}
            />
            <TextField
              id="outlined-basic"
              label="Email"
              fullWidth
              margin="normal"
              variant="outlined"
              disabled
              value={userDetails.email}
              style={{
                backgroundColor: "rgb(45, 45, 73)",
                borderRadius: "5px",
              }}
            />
            <TextField
              id="outlined-basic"
              label="Display Name"
              fullWidth
              margin="normal"
              variant="outlined"
              value={displayName}
              style={{
                backgroundColor: "rgb(45, 45, 73)",
                borderRadius: "5px",
              }}
              onChange={(e) => {
                setDisplayName(e.target.value);
              }}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} style={{ color: "white" }}>
            Cancel
          </Button>
          <Button
            onClick={(e) => updateProfileHandler(e)}
            color="primary"
            variant="contained"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditProfile;

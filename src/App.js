import { makeStyles } from "@mui/styles";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Application from "./components/Application";
import Chat from "./components/Chat";
import Home from "./components/Home";
import Login from "./components/Login";
import { auth } from "./firebase/firebase";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backGroundColor: "#22273b !important",
    height: "100vh",
  },
}));

function App() {
  const classes = useStyles();
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user.uid);
      } else {
        setUser(null);
      }
    });
  }, []);

  return (
    <div className="App">
      {!user ? (
        <Login />
      ) : (
        <div className={classes.root}>
          <Application />
          <main className={classes.content}>
            <div className={classes.toolbar} style={{ minHeight: "50px" }}>
              <Routes>
                <Route exact path="/" element={<Home />} />
                <Route path="/channel/:id" element={<Chat />} />
              </Routes>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}

export default App;

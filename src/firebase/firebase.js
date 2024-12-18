import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCQ_vTCa7Y-NKh2N9JprffaD1qhT0PYhUQ",
  authDomain: "chatify-475bc.firebaseapp.com",
  projectId: "chatify-475bc",
  storageBucket: "chatify-475bc.firebasestorage.app",
  messagingSenderId: "138568077346",
  appId: "1:138568077346:web:aba180c0f1d9284e823a7b",
  measurementId: "G-31WVHWR9EC",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, provider, signInWithPopup, storage };

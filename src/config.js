import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {};

// Initialize Firebase
const fire = firebase.initializeApp(firebaseConfig);

// Use these for db & auth
const db = fire.firestore();
const auth = firebase.auth();
const rdb = getDatabase(fire);
const analytics = getAnalytics(fire);

export { auth, db, rdb, analytics };

import * as firebase from "firebase";
import initFirebaseListener from "./firebase-listener";
import initFirebaseCron from "./firebase-cron";

firebase.initializeApp({
	serviceAccount: "../go-bat-firebase.json",
	databaseURL: "https://go-bat.firebaseio.com"
});
const db = firebase.database();

// Start firebase listener
initFirebaseListener(db);

// Start duplicate checker poll
initFirebaseCron(db);
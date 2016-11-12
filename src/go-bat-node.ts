import * as firebase from "firebase";
import initFirebaseListener from "./firebase-listener";
import initFirebaseCron from "./firebase-cron";
import * as admin from "firebase-admin";

const serviceAccount = require("../../go-bat-firebase.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://go-bat.firebaseio.com"
});

const db = admin.database();

// Start firebase listener
initFirebaseListener(db);

// Start duplicate checker poll
initFirebaseCron(db);
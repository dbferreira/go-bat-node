import * as firebase from "firebase";
import createTeam from "./teams";
import * as players from "./players";

firebase.initializeApp({
	serviceAccount: "../go-bat-firebase.json",
	databaseURL: "https://go-bat.firebaseio.com"
});

const db = firebase.database();
const teamQueueRef = db.ref("queues/teams");
const playerQueueRef = db.ref("queues/players");

// Listen to the teams queue and create a new team
teamQueueRef.on("child_added", (snapshot, prevChildKey) => {
	const newQueueItem = snapshot.val();
	createTeam(newQueueItem, db);
});

// Listen to the players queue and add a new player to a team
playerQueueRef.on("child_added", (snapshot, prevChildKey) => {
	const newQueueItem = snapshot.val();
	players.handlePlayerPull(newQueueItem, db);
});

console.info("Listening for changes to the queue... ");

import createTeam from "./teams";
import * as players from "./players";
import * as fixtures from "./fixtures";

export default function initFirebase(db: any): void {
	const teamQueueRef = db.ref("queues/teams");
	const playerQueueRef = db.ref("queues/players");
	const fixturesQueueRef = db.ref("queues/fixtures");

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

	// Listen to the players queue and add a new player to a team
	fixturesQueueRef.on("child_added", (snapshot, prevChildKey) => {
		const newQueueItem = snapshot.val();
		fixtures.arrangeFixture(newQueueItem, db);
	});

	console.info("Listening for jobs in the queue... ");
}
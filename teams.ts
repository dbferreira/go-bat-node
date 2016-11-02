import * as players from './players';
import * as Random from "random-js";

const random = new Random(Random.engines.mt19937().autoSeed());
const teamSize = 15;

export default function createTeam(teamData, db: firebase.database.Database): void {
	const teamRef = db.ref("teams");
	const teamQueueRef = db.ref("queues/teams");
	const userKey = teamData.user;
	teamRef.child(userKey)
		.set({
			user: userKey,
			name: teamData.name
		})
		.then((result) => {
			teamQueueRef.child(userKey).remove().then(() => assignPlayers(userKey, db));
		});
}

function assignPlayers(teamID: string, db: firebase.database.Database): void {
	for (let i = 0; i < teamSize; i++) {
		const playerAge = random.integer(17, 35);
		players.createPlayer(teamID, db, playerAge);
	}
}

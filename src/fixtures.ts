import * as players from './players';
import * as Random from "random-js";

const random = new Random(Random.engines.mt19937().autoSeed());

export function arrangeFixture(fixtureData, db: firebase.database.Database): void {
	const matchRef = db.ref("matches");
	const fixturesQueueRef = db.ref("queues/fixtures");
	const userKey = fixtureData.user;
	const vs = getOpponent(userKey, fixtureData.vs);
	matchRef.child(userKey)
		.set({
			user: userKey,
			vs: vs,
			time: Date.now()
		})
		.then((result) => {
			fixturesQueueRef.child(userKey).remove().then(() => console.log("Done... do something here"));
		});
}

function getOpponent(userKey: string, vsKey: string): string {
	if (vsKey === "random")
		return getRandomOpponent(userKey);
	return vsKey;
}

function getRandomOpponent(userKey: string): string {
	return userKey;
}

// function assignPlayers(teamID: string, region: string, db: firebase.database.Database): void {
// 	for (let i = 0; i < teamSize; i++) {
// 		const playerAge = random.integer(17, 35);
// 		players.createPlayer(teamID, db, playerAge, region);
// 	}
// }

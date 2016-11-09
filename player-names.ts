import * as request from "request";

export const countries = {
	"ZA": "Netherlands",
	"ZW": "Canada",
	"AU": "Australia",
	"NZ": "New+Zealand",
	"GB": "England",
	"IN": "India",
	"LK": "India",
	"PK": "Pakistan"
};

interface UINamesPlayer {
	name: string;
	surname: string;
}

export function getRandomPlayerName(region: string, db: firebase.database.Database, callback: Function, retryCount: number = 2): void {
	const url = `http://uinames.com/api/?gender=male&region=${countries[region]}`;
	request(url, (error, response, body) => {
		if (!error && response.statusCode === 200) {
			try {
				const player = <UINamesPlayer>JSON.parse(body);
				storeNameData(region, player, db);
				callback(player);
			} catch (error) {
				getRandomPlayerName(region, db, callback, --retryCount);
			}
		} else {
			console.log("Error fetching player name, retrying another", retryCount, "times (statusCode:", response.statusCode, ")");
			if (retryCount > 0) {
				getRandomPlayerName(region, db, callback, --retryCount);
			} else {
				console.log("Failed after third attempt, stopping... ");
				callback(null);
			}
		}
	});
}

function storeNameData(region: string, player: UINamesPlayer, db: firebase.database.Database): void {
	const nameRef = db.ref(`/names/${region}/names`);
	const surnameRef = db.ref(`/names/${region}/surnames`);

	// Add name to DB
	nameRef.limitToLast(1).once("value", (snapshot) => {
		const nameID = fetchID(snapshot.val());
		nameRef.child(nameID)
			.set({
				id: nameID,
				name: player.name
			});
	});

	// Add surname to DB
	surnameRef.limitToLast(1).once("value", (snapshot) => {
		const surnameID = fetchID(snapshot.val());
		surnameRef.child(surnameID)
			.set({
				id: surnameID,
				surname: player.surname
			});
	});
}

function fetchID(value): string {
	let id = "0";
	if (value && value[0]) {
		id = (+value[0].id + 1).toString();
	} else if (value && value[1]) {
		id = (+value[1].id + 1).toString();
	} else if (value && typeof value === "object") {
		id = (+Object.keys(value)[0] + 1).toString();
	} else {
		id = "0";
	}
	return id;
}
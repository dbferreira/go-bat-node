import * as Random from "random-js";
import * as playerNames from "./player-names";

const random = new Random(Random.engines.mt19937().autoSeed());

// Have a 1 in 2 chance of assigning a player from another country to this  team
function getCountry(useCountry: string): string {
	const countryKeys = Object.keys(playerNames.countries);
	if (random.integer(0, 1) === 1) {
		const countryIndex = random.integer(0, countryKeys.length);
		return countryKeys[countryIndex];
	} else {
		return useCountry;
	}
}

export function handlePlayerPull(playerData, db: firebase.database.Database): void {
	createPlayer(playerData.user, db, 16, playerData.region); // Pull a young player from youth league
}

export function createPlayer(teamID: string, db: firebase.database.Database, age: number, useCountry: string = "ZA"): void {
	const playerRef = db.ref("players");
	const playerQueueRef = db.ref("queues/players");
	const country = getCountry(useCountry);
	const getRandomRating = (): number => {
		return Math.round(random.real(1, 7.5, true) * 100) / 100;
	};

	playerNames.getRandomPlayerName(country, db, (playerJSON) => {
		if (playerJSON) {
			playerRef.child(teamID)
				.push({
					age: age,
					name: playerJSON.name,
					surname: playerJSON.surname,
					created: Date.now(),
					nationality: country.toLowerCase(),
					team: teamID,
					batting: getRandomRating(),
					bowling: getRandomRating(),
					stamina: getRandomRating(),
					fitness: random.integer(3, 7)
				})
				.then((result) => playerQueueRef.child(teamID).remove());
		} else {
			createPlayer(teamID, db, age, useCountry); // This here will cause an infinite loop if the name server is down. Rather get player name from firebase.
		}
	});
}

// const futureCountries = {
	// "NL": "Netherlands",
	// "US": "United+States",
	// "Albania",
	// "Argentina",
	// "Armenia",
	// "Australia",
	// "Austria",
	// "Azerbaijan",
	// "Bangladesh",
	// "Belgium",
	// "Bosnia and Herzegovina",
	// "Brazil",
	// "Canada",
	// "China",
	// "Colombia",
	// "Denmark",
	// "Egypt",
	// "England",
	// "Estonia",
	// "Finland",
	// "France",
	// "Georgia",
	// "Germany",
	// "Greece",
	// "Hungary",
	// "India",
	// "Iran",
	// "Israel",
	// "Italy",
	// "Japan",
	// "Korea",
	// "Mexico",
	// "Morocco",
	// "Netherlands",
	// "New Zealand",
	// "Nigeria",
	// "Norway",
	// "Pakistan",
	// "Poland",
	// "Portugal",
	// "Romania",
	// "Russia",
	// "Slovakia",
	// "Slovenia",
	// "Spain",
	// "Sweden",
	// "Switzerland",
	// "Turkey",
	// "Ukraine",
	// "United States",
	// "Vietnam",
// }
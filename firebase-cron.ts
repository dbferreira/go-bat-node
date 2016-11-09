import * as cron from "node-cron";

export default function initFirebaseCron(db: firebase.database.Database): void {
	cron.schedule('* 1 * * *', () => {
		console.log("Checking for duplicates...");
		removeDuplicateNames(db);
	});
}

function replace(path: string, key: string, array: Object[], namesRef: firebase.database.Reference): void {
	const pathRef = namesRef.child(path);
	pathRef.remove();
	for (let object of array) {
		let newObject = { id: object['id'] };
		newObject[key] = object[key];
		pathRef.child(object['id'])
			.set(newObject);
	}
}

function unique(array: Object[], key: string): Object[] {
	const exist = [];
	const returnObject = [];
	let id = 0;
	for (let i = 0; i < array.length; i++) {
		const object = array[i];
		const value = object[key];
		if (exist.indexOf(value) === -1) {
			exist.push(value);
			let newItem = { 'id': id.toString() };
			newItem[key] = value;
			returnObject.push(newItem);
			id++;
		}
	}
	return returnObject;
};

function removeDuplicateNames(db: firebase.database.Database): void {
	const namesQueueRef = db.ref("names/");
	namesQueueRef.once("value", (snapshot, prevChildKey) => {
		const countries = snapshot.val();
		for (let country in countries) {
			const names = countries[country].names;
			const surnames = countries[country].surnames;
			const uniqueNames = unique(names, "name");
			const uniqueSurnames = unique(surnames, "surname");
			if (names.length !== uniqueNames.length)
				replace(`${country}/names/`, 'name', uniqueNames, namesQueueRef);
			if (surnames.length !== uniqueSurnames.length)
				replace(`${country}/surnames/`, 'surname', uniqueSurnames, namesQueueRef);
		}
	});
}

/**
 * A class that contain a lot of data about user.
 * This will carry around with user across game
 */

interface HeroInternalData {
	level: number;
}

class User {
	createdAt: Date;
	username: string;
	private _uid: string;
	private allHeroes: Map<string, HeroInternalData>;
	private partyList: string[];

	constructor(def: any) {
		this.createdAt = def.createdAt;
		this.username = def.username;
		this._uid = def._uid;

		this.allHeroes = new Map();
		for (const hero of def.allHeroes) {
			this.allHeroes.set(hero.name, hero.level);
		}

		this.partyList = [];
		for (const heroName of def.partyList) {
			this.partyList.push(heroName);
		}
	}
}

/**
 * A class that contain a lot of data about user.
 * This will carry around with user across game
 */

import { HERO_DEFS } from '@/script/interface/entity/hero_defs';
import { HeroDef } from '@/script/interface/entity/HeroDef';
import { HeroStats } from '@/script/interface/system/HeroStats';
import { UserDef } from '@/script/interface/system/UserDef';
import { Hero } from '@/script/object/party/Hero';
import { EntityBaseState } from '@/script/state/entity/EntityBaseState';
import { HeroAttackState } from '@/script/state/entity/party/HeroAttackState';
import { HeroBaseState } from '@/script/state/entity/party/HeroBaseState';
import { HeroIdleState } from '@/script/state/entity/party/HeroIdleState';
import { StateMachine } from '@/script/state/StateMachine';

const _heroTable: { [key: string]: (lvl: number) => Hero } = {
	['soldier']: (level: number) => {
		const soldierDef: HeroDef = HERO_DEFS.soldier;
		const soldier = new Hero(soldierDef, level);

		const soldierState = new Map<string, () => EntityBaseState>();
		soldierState.set('idle', () => new HeroIdleState(soldier));
		soldierState.set('run', () => new HeroBaseState(soldier));
		soldierState.set('attack', () => new HeroAttackState(soldier));

		soldier.setStateMachine = new StateMachine(soldierState);
		soldier.setDirection = 'left';
		soldier.changeState('idle');

		return soldier;
	},
	['wizard']: (level: number) => {
		const wizardDef: HeroDef = HERO_DEFS.wizard;
		const wizard = new Hero(wizardDef, level);

		const wizardState = new Map<string, () => EntityBaseState>();
		wizardState.set('idle', () => new HeroIdleState(wizard));
		wizardState.set('run', () => new HeroBaseState(wizard));
		wizardState.set('attack', () => new HeroAttackState(wizard));

		wizard.setStateMachine = new StateMachine(wizardState);
		wizard.setDirection = 'left';
		wizard.changeState('idle');

		return wizard;
	},
};

export class User {
	createdAt: number;
	username: string;
	active: boolean;
	items: Map<string, number>;

	private allHeroes: Map<string, Hero>;
	private party: string[];
	worlds: Map<string, number>;

	constructor(def: UserDef) {
		this.active = def.active;
		this.username = def.username;
		this.createdAt = def.createdAt;

		this.party = [...def.party];

		this.items = new Map(Object.entries(def.items));

		this.worlds = new Map(Object.entries(def.worlds));

		this.allHeroes = new Map();
		for (const [key, value] of Object.entries(def.allHeroes)) {
			let level = value.level;
			let currentExp = value.currentExp;
			let expToLevel = value.expToLevel;
			if (!level) {
				(level = 1), console.warn('[System] Value.level is not available in while assigning');
			}

			if (!currentExp) {
				(currentExp = 0), console.warn('[System] Value.currentExp is not available in while assigning');
			}
			if (!expToLevel) {
				// No need to give error value, By default frontend know the value
				console.warn('[System] Value.expToLevel is not available in while assigning');
			}

			// 01 Init the Hero
			const hero: Hero = _heroTable[key](level);
			hero.currentExp = currentExp;

			this.allHeroes.set(key, hero);
		}
	}

	get getParty() {
		return this.party;
	}

	get getAllHeroes() {
		return this.allHeroes;
	}

	toPlainObject(): UserDef {
		const allHeroes: { [key: string]: HeroStats } = {};
		for (const [k, hero] of this.getAllHeroes.entries()) {
			allHeroes[k] = { level: hero.level, currentExp: hero.currentExp, expToLevel: hero.expToLevel };
		}

		const items = Object.fromEntries(this.items);
		const worlds = Object.fromEntries(this.worlds);

		// Party appears to be an iterable, spreading is fine here
		const party = [...this.getParty];

		const userDef = <UserDef>{
			allHeroes,
			items,
			party,
			worlds,
		};

		// We want the program to stop if there is undefined / unexpected data structure
		const ok = this.validateBeforeSave(userDef);
		if (!ok) {
			console.error(userDef, this);
			throw new Error('Unexpected error while converting the User');
		}

		return userDef;
	}

	private validateBeforeSave(data: UserDef): boolean {
		if (data.items === undefined) return false;
		if (data.worlds === undefined) return false;
		if (data.allHeroes === undefined) return false;
		if (data.party === undefined || data.party.length <= 0) return false;

		return true;
	}
}

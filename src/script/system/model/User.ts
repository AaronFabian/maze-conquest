/**
 * A class that contain a lot of data about user.
 * This will carry around with user across game
 */

import { HERO_DEFS } from '@/script/interface/entity/hero_defs';
import { HeroDef } from '@/script/interface/entity/HeroDef';
import { UserDef } from '@/script/interface/system/UserDef';
import { Hero } from '@/script/object/party/Hero';
import { EntityBaseState } from '@/script/state/entity/EntityBaseState';
import { HeroAttackState } from '@/script/state/entity/party/HeroAttackState';
import { HeroBaseState } from '@/script/state/entity/party/HeroBaseState';
import { HeroIdleState } from '@/script/state/entity/party/HeroIdleState';
import { StateMachine } from '@/script/state/StateMachine';

const heroTable: { [key: string]: (lvl: number) => Hero } = {
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
			this.allHeroes.set(key, heroTable[key](value.level));
		}
	}

	get getParty() {
		return this.party;
	}

	get getAllHeroes() {
		return this.allHeroes;
	}
}

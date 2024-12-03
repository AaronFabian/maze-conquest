/**
 * A class that contain a lot of data about user.
 * This will carry around with user across game
 */

import { HERO_DEFS } from '@/script/interface/entity/hero_defs';
import { HeroDef } from '@/script/interface/entity/HeroDef';
import { Entity } from '@/script/object/entity/Entity';
import { Hero } from '@/script/object/party/Hero';
import { EntityBaseState } from '@/script/state/entity/EntityBaseState';
import { HeroAttackState } from '@/script/state/entity/party/HeroAttackState';
import { HeroBaseState } from '@/script/state/entity/party/HeroBaseState';
import { HeroIdleState } from '@/script/state/entity/party/HeroIdleState';
import { StateMachine } from '@/script/state/StateMachine';

export interface HeroInternalData {
	level: number;
	HP: number;
}

export class User {
	createdAt: Date;
	username: string;
	active: boolean;
	items: Map<string, number>;

	private _uid: string;
	private allHeroes: Map<string, Hero>;
	private party: string[];

	private heroTable: { [key: string]: Function } = {
		['soldier']: function (level: number): Hero {
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
	};

	constructor(def: any) {
		this.createdAt = def.createdAt;
		this.username = def.username;
		this._uid = def._uid;
		this.items = def.items;

		this.allHeroes = new Map();
		for (const [key, value] of Object.entries(def.allHeroes) as any) {
			this.allHeroes.set(key, this.heroTable[key](value.level));
		}

		this.party = [];
		for (const heroName of def.party) {
			this.party.push(heroName);
		}

		this.createdAt = def.createdAt;
		this.active = def.active;

		console.log('[System Log] User with UID: ' + this._uid);
	}

	get getParty() {
		return this.party;
	}

	get getAllHeroes() {
		return this.allHeroes;
	}
}

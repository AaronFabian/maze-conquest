import { ENEMY_DEFS } from '@/script/interface/entity/enemy_defs';
import { EnemyDef } from '@/script/interface/entity/EnemyDef';
import { Entity } from '@/script/object/entity/Entity';
import { Hero } from '@/script/object/party/Hero';
import { EnemyActionState } from '@/script/state/game/EnemyActionState';
import { SystemError } from '@/script/world/Error/SystemError';

export class Enemy extends Entity {
	name: string;
	baseHP: number;
	baseAttack: number;
	baseDefense: number;
	baseSpeed: number;
	HPIV: number;
	attackIV: number;
	defenseIV: number;
	speedIV: number;
	defense: number;
	attack: number;
	speed: number;
	level: number;
	currentExp: number;
	expToLevel: number;
	currentHP: number;
	override HP: number;
	moveSet: {
		[key: string]: (enemy: Enemy, hero: Hero) => (enemyActionState: EnemyActionState) => void;
	};
	exp: number;
	constructor(def: EnemyDef, level: number) {
		super(def);

		this.name = def.name;

		this.baseHP = def.baseHP;
		this.baseAttack = def.baseAttack;
		this.baseDefense = def.baseDefense;
		this.baseSpeed = def.baseSpeed;

		this.HPIV = def.HPIV;
		this.attackIV = def.attackIV;
		this.defenseIV = def.defenseIV;
		this.speedIV = def.speedIV;

		this.HP = this.baseHP;
		this.defense = this.baseDefense;
		this.attack = this.baseAttack;
		this.defense = this.baseDefense;
		this.speed = this.baseSpeed;

		this.level = level;
		this.currentExp = 0;
		this.expToLevel = this.level * this.level * 5 * 0.75;

		// this.calculateStats();

		this.currentHP = this.HP;
		this.moveSet = def.moveSet;
		this.exp = def.exp;
	}

	override damage(value: number): void {
		this.currentHP -= value;
	}

	calculateStats() {}

	calculateAttack(moveName: string, hero: Hero) {
		const baseDmg: number | undefined = ENEMY_DEFS[this.name].attackStatsTable.get(moveName);
		if (baseDmg === undefined)
			throw new SystemError('Unexpected error while calculateAttack(). The return value get undefined');

		const dmg = Math.max(1, baseDmg * this.attack - hero.defense);
		hero.damage(dmg);
		console.log(`[Battle Log] ${hero.name} damaged by ${dmg}`);
		if (hero.currentHP <= 0) {
			hero.isAlive = false;
		}
	}
}

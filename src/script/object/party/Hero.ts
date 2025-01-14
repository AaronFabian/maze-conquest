import { HERO_DEFS } from '@/script/interface/entity/hero_defs';
import { HeroDef } from '@/script/interface/entity/HeroDef';
import { Entity } from '@/script/object/entity/Entity';
import { Enemy } from '@/script/object/party/Enemy';
import { ActionState } from '@/script/state/game/ActionState';
import { SystemError } from '@/script/system/error/SystemError';

export class Hero extends Entity {
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
		[key: string]: (hero: Hero, enemy: Enemy) => (actionState: ActionState) => void;
	};
	intelligent: any;
	baseIntelligent: number;
	intelligentIV: number;
	constructor(def: HeroDef, level: number) {
		super(def);

		this.name = def.name;

		this.baseHP = def.baseHP;
		this.baseAttack = def.baseAttack;
		this.baseDefense = def.baseDefense;
		this.baseSpeed = def.baseSpeed;
		this.baseIntelligent = def.baseIntelligent;

		this.HPIV = def.HPIV;
		this.attackIV = def.attackIV;
		this.defenseIV = def.defenseIV;
		this.speedIV = def.speedIV;
		this.intelligentIV = def.intelligentIV;

		this.HP = this.baseHP;
		this.defense = this.baseDefense;
		this.attack = this.baseAttack;
		this.defense = this.baseDefense;
		this.speed = this.baseSpeed;

		this.level = level;
		this.currentExp = 0;
		this.expToLevel = Math.ceil(this.level * this.level * 5 * 0.75);

		this.calculateStats();

		this.currentHP = this.HP;

		this.moveSet = def.moveSet;
	}

	override damage(value: number) {
		this.currentHP -= value;
	}

	calculateStats() {
		// Small improvement, if the this Hero at level 1 then no need to calculate use the base stats;
		for (let i = 2; i <= this.level; i++) {
			this.statsLevelUp();
		}
	}

	statsLevelUp() {
		this.HP += this.baseHP + this.HPIV * 2;
		this.attack += this.baseAttack + this.attackIV * 1.5;
		this.defense += this.baseDefense + this.defenseIV * 0.5;
		this.speed += this.baseSpeed + this.speedIV * 1.5;
		this.intelligent += this.baseIntelligent + this.intelligentIV * 2;
	}

	levelUP() {
		this.level += 1;
		this.expToLevel = Math.ceil(this.level * this.level * 5 * 0.75);

		this.statsLevelUp();

		this.currentExp = 0;
	}

	calculateAttack(moveName: string, enemy: Enemy) {
		const baseDmg: number | undefined = HERO_DEFS[this.name].attackStatsTable.get(moveName);
		if (baseDmg === undefined)
			throw new SystemError('Unexpected error while calculateAttack(). the return value get undefined');

		const dmg = Math.max(1, baseDmg * this.attack - enemy.defense);
		console.log(`[Battle Log] ${enemy.name} damaged by ${dmg}`);

		enemy.damage(dmg);
		if (enemy.currentHP <= 0) {
			enemy.isAlive = false;
		}
	}
}

import { EnemyDef } from '@/script/interface/entity/EnemyDef';
import { Entity } from '@/script/object/entity/Entity';

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
	}

	calculateStats() {}
}

import { EntityDef } from '@/script/interface/entity/EntityDef';

export interface EnemyDef extends EntityDef {
	name: string;
	baseHP: number;
	baseAttack: number;
	baseDefense: number;
	baseSpeed: number;
	HPIV: number;
	attackIV: number;
	defenseIV: number;
	speedIV: number;
}

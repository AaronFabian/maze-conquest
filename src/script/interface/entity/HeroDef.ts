import { EntityDef } from '@/script/interface/entity/EntityDef';

/*
local def = {
	name,
	battleSpriteFront,
	battleSpriteBack,
	baseHP,
	baseAttack,
	baseDefense,
	baseSpeed,
	HPIV,
	attackIV,
	defenseIV,
	speedIV
}
*/

export interface HeroDef extends EntityDef {
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

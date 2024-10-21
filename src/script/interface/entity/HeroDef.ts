import { EntityDef } from '@/script/interface/entity/EntityDef';
import { Enemy } from '@/script/object/party/Enemy';
import { Hero } from '@/script/object/party/Hero';
import { ActionState } from '@/script/state/game/ActionState';
import { HeroCommand } from '@/script/interface/game/HeroCommand';

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
	moveSet: { [key: string]: (hero: Hero, enemy: Enemy) => (actionState: ActionState) => void }; // !
	attackStatsTable: Map<string, number>;
	heroCommand: HeroCommand;
}

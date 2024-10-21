import { EntityDef } from '@/script/interface/entity/EntityDef';
import { Enemy } from '@/script/object/party/Enemy';
import { Hero } from '@/script/object/party/Hero';
import { EnemyActionState } from '@/script/state/game/EnemyActionState';

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

	moveSet: { [key: string]: (enemy: Enemy, hero: Hero) => (enemyActionState: EnemyActionState) => void }; // !
	attackStatsTable: Map<string, number>;
	exp: number;
}

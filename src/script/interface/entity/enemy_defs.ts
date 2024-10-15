import { EnemyDef } from '@/script/interface/entity/EnemyDef';

export const ENEMY_DEFS = {
	orc: <EnemyDef>{
		name: 'orc',
		animations: {
			['idle-right']: {
				frames: [0, 1, 2, 3, 4, 5],
				texture: 'orc',
				interval: 4,
				looping: true,
			},
			['run-right']: {
				frames: [8, 9, 10, 11, 12, 13, 14, 15],
				texture: 'orc',
				interval: 4,
				looping: true,
			},
			['attack-right-1']: {
				frames: [16, 17, 18, 19, 20, 21],
				texture: 'orc',
				interval: 4,
				looping: true,
			},
			['attack-right-2']: {
				frames: [15, 16, 17, 18, 19, 20],
				texture: 'orc',
				interval: 4,
				looping: true,
			},
			['hurt-right']: {
				frames: [32, 33, 34, 35],
				texture: 'orc',
				interval: 4,
				looping: true,
			},
			['death-right']: {
				frames: [40, 41, 42, 43],
				texture: 'orc',
				interval: 4,
				looping: true,
			},
		},
		HP: 10,
		baseHP: 10,
		baseAttack: 1,
		baseDefense: 1,
		baseSpeed: 1,
		x: 0,
		y: 0,
		width: 16,
		height: 16,
		renderOffSetX: -42,
		renderOffSetY: -40,
	},
};

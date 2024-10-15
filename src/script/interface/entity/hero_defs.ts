import { HeroDef } from '@/script/interface/entity/HeroDef';

export const HERO_DEFS = {
	soldier: <HeroDef>{
		name: 'soldier',
		animations: {
			['idle-left']: {
				frames: [0, 1, 2, 3, 4, 5],
				texture: 'soldier',
				interval: 4,
				looping: true,
			},
			['run-left']: {
				frames: [54, 55, 56, 57, 58, 59, 60, 61],
				texture: 'soldier',
				interval: 4,
				looping: true,
			},
			['attack-left-1']: {
				frames: [9, 10, 11, 12, 13, 14],
				texture: 'soldier',
				interval: 4,
				looping: true,
			},
			['attack-left-2']: {
				frames: [18, 19, 20, 21, 22, 23, 24, 25, 26],
				texture: 'soldier',
				interval: 4,
				looping: true,
			},
			['attack-left-3']: {
				frames: [27, 28, 29, 30, 31, 32],
				texture: 'soldier',
				interval: 4,
				looping: true,
			},
			['hurt-left']: {
				frames: [36, 37, 38, 39],
				texture: 'soldier',
				interval: 4,
				looping: true,
			},
			['death-left']: {
				frames: [45, 46, 47, 48],
				texture: 'soldier',
				interval: 4,
				looping: true,
			},
		},
		HP: 0,
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

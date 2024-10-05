import { canvas } from '@/global';
import { EntityDef } from '@/script/interface/entity/EntityDef';

export const ENTITY_DEFS = {
	player: <EntityDef>{
		animations: {
			['walk-left']: {
				frames: [6, 7, 8, 9, 10, 11],
				texture: 'player',
				interval: 4,
				looping: true,
			},
			['walk-right']: {
				frames: [18, 19, 20, 21, 22, 23],
				texture: 'player',
				interval: 4,
				looping: true,
			},
			['walk-up']: {
				frames: [0, 1, 2, 3, 4, 5],
				texture: 'player',
				interval: 4,
				looping: true,
			},
			['walk-down']: {
				frames: [12, 13, 14, 15, 16, 17],
				texture: 'player',
				interval: 4,
				looping: true,
			},
			['idle-left']: {
				frames: [42, 43, 44, 45, 46],
				texture: 'player',
				interval: 6,
				looping: true,
			},
			['idle-right']: {
				frames: [36, 37, 38, 39, 40],
				texture: 'player',
				interval: 6,
				looping: true,
			},
			['idle-up']: {
				frames: [24, 25, 26, 27, 28],
				texture: 'player',
				interval: 6,
				looping: true,
			},
			['idle-down']: {
				frames: [30, 31, 32, 33],
				texture: 'player',
				interval: 8,
				looping: true,
			},
		},
		HP: 10,
		x: 0,
		y: 0,
		width: 16,
		height: 16,
		renderOffSetX: -8,
		renderOffSetY: -8,
	},
};

import { canvas } from '@/global';
import { EntityDef } from '@/script/interface/entity/EntityDef';

export const ENTITY_DEFS = {
	player: <EntityDef>{
		animations: {
			['walk-left']: {
				frames: [6, 7, 8, 9, 10, 11],
				interval: 0,
				texture: 'player',
			},
			['walk-right']: {
				frames: [12, 13, 14, 15, 16, 17],
				interval: 0,
				texture: 'player',
			},
			['walk-up']: {
				frames: [0, 1, 2, 3, 4, 5],
				interval: 0,
				texture: 'player',
			},
			['walk-down']: {
				frames: [18, 19, 20, 21, 22, 23],
				interval: 8,
				looping: true,
				texture: 'player',
			},
			['idle-left']: {
				frames: [42, 43, 44, 45, 46],
				interval: 0,
				texture: 'player',
			},
			['idle-right']: {
				frames: [36, 37, 38, 39, 40],
				interval: 0,
				texture: 'player',
			},
			['idle-up']: {
				frames: [24, 25, 26, 27, 28],
				interval: 0,
				texture: 'player',
			},
			['idle-down']: {
				frames: [30, 31, 32, 33],
				interval: 8,
				looping: true,
				texture: 'player',
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

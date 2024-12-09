import { GameObjectDef } from '@/script/interface/object/GameObjectDef';

export const GAME_OBJECT_DEFS: { [key: string]: GameObjectDef } = {
	portal: {
		animations: {
			['default']: {
				frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
				texture: 'portal',
				interval: 8,
				looping: true,
			},
		},
		x: 120,
		y: 272,
		width: 32,
		height: 32,
	},
	campfire: {
		animations: {
			['default']: {
				frames: [0, 1, 2, 3],
				texture: 'campfire',
				interval: 4,
				looping: true,
			},
		},
		x: 112,
		y: 176,
		width: 16,
		height: 16,
	},
	wrapEffect: {
		animations: {
			['default']: {
				frames: [0, 1, 2, 3, 4, 5, 5, 4, 3, 2, 1, 0],
				texture: 'wrap-effect',
				interval: 4,
				looping: false,
			},
		},
		x: 0,
		y: 0,
		width: 32,
		height: 32,
	},
	door: {
		animations: {
			['default']: {
				texture: 'door',
				frames: [0],
			},
			['open']: {
				frames: [0, 1, 2, 3, 4],
				texture: 'door',
				interval: 8,
				looping: false,
			},
			['close']: {
				frames: [4, 3, 2, 1, 0],
				texture: 'door',
				interval: 8,
				looping: false,
			},
		},
		x: 0,
		y: 0,
		width: 16,
		height: 32,
	},
};

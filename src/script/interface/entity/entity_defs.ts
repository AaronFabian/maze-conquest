import { canvas, gStateStack } from '@/global';
import { EntityDef } from '@/script/interface/entity/EntityDef';
import { Player } from '@/script/object/entity/Player.js';
import { DialogueState } from '@/script/state/game/DialogueState';
import { HandleAsyncState } from '@/script/state/game/HandleAsyncState';
import { PromptState } from '@/script/state/game/PromptState';
import { Town } from '@/script/world/Town';

export const ENTITY_DEFS: { [key: string]: EntityDef } = {
	player: {
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
	soldier: {
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
		HP: 10,
		x: 0,
		y: 0,
		width: 16,
		height: 16,
		renderOffSetX: 0,
		renderOffSetY: 0,
	},
	beginningNPC: {
		animations: {
			['idle-down']: {
				frames: [9, 10, 11],
				texture: 'npcs',
				interval: 10,
				looping: true,
			},
			['idle-left']: {
				frames: [21, 22, 23],
				texture: 'npcs',
				interval: 10,
				looping: true,
			},
			['idle-right']: {
				frames: [33, 34, 35],
				texture: 'npcs',
				interval: 10,
				looping: true,
			},
			['idle-up']: {
				frames: [45, 46, 47],
				texture: 'npcs',
				interval: 10,
				looping: true,
			},
		},
		HP: 10,
		x: 32,
		y: 112,
		width: 16,
		height: 16,
		renderOffSetX: -8,
		renderOffSetY: -13,

		/*
			obj: this
			other: another entity that interact with; mainly with Player entity
		*/
		onInteract: (obj, other) => {
			const player = other as Player;
			const town = player.level as Town;
			if (!(town instanceof Town)) throw new Error('Unexpected error while saving. town is not instance of Town class');

			// 01
			gStateStack.push(
				new PromptState(
					canvas.width / 2 - 180,
					canvas.height / 2 - 134 + 240,
					120,
					32,
					'Save your progress ? This progress will save your game into cloud',
					{
						onYes: () => {
							// 02
							gStateStack.push(
								new HandleAsyncState({
									info: 'Saving data into cloud. Do not close the window',
									operation: async () => {
										await new Promise((res, rej) => setTimeout(res, 5000));
									},
									onAsyncEnd: () => {
										// 03
										gStateStack.pop();
										gStateStack.push(
											new DialogueState(player.level, 'Save completed !', () => {
												gStateStack.pop();
											})
										);
									},
								})
							);
						},
						onNo: () => {
							// ... nothing to do
						},
					}
				)
			);
		},
	},
};

ENTITY_DEFS['tutorialNPC'] = { ...ENTITY_DEFS['beginningNPC'] };
ENTITY_DEFS['tutorialNPC'].onInteract = () => {};

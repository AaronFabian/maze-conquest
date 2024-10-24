import { Tween } from '@/global';
import { HeroDef } from '@/script/interface/entity/HeroDef';
import { Enemy } from '@/script/object/party/Enemy';
import { Hero } from '@/script/object/party/Hero';
import { ActionState } from '@/script/state/game/ActionState';
import { SelectEnemyPartyState } from '@/script/state/game/SelectEnemyPartyState';

export const HERO_DEFS: { [key: string]: HeroDef } = {
	soldier: {
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
				frames: [14, 13, 12, 11, 10, 9],
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
			},
			['victory-left']: {
				frames: [13],
				texture: 'soldier',
				interval: 0,
			},
		},
		HP: 0,
		baseHP: 10,
		baseAttack: 3,
		baseDefense: 10,
		baseSpeed: 8,
		baseIntelligent: 3,
		HPIV: 3,
		attackIV: 4,
		defenseIV: 2,
		speedIV: 3,
		intelligentIV: 3,
		x: 0,
		y: 0,
		width: 16,
		height: 16,
		renderOffSetX: -42,
		renderOffSetY: -40,
		moveSet: {
			['attack']: (hero, enemy) =>
				function (actionState) {
					actionState.isPerformingAction = true;
					if (!hero.isAlive || !enemy.isAlive) {
						actionState.isPerformingAction = false;
						return;
					}

					const act1 = new Tween(hero)
						.onStart(() => {
							// Action Start
							actionState.isPerformingAction = true;
							hero.changeState('run');
						})
						.to({ x: hero.x - 18 }, 150)
						.onComplete(() => {});

					const act2 = new Tween(hero)
						.onStart(() => {
							hero.changeState('attack');
							// Instead creating the new class for changing Animation just set the Animation
							enemy.setAnimation = 'hurt-' + enemy.direction;
						})
						.to({}, 500)
						.onComplete();

					const act3 = new Tween(hero)
						.onStart(() => {
							hero.changeState('run');

							// Here performing the battle calculation
							hero.calculateAttack('attack', enemy);
							if (enemy.isAlive) {
								enemy.setAnimation = 'idle-' + enemy.direction;
							} else {
								enemy.setAnimation = 'death-' + enemy.direction;
							}
						})
						.to({ x: hero.x }, 150)
						.onComplete(() => {
							// Action Finished
							hero.changeState('idle');
						});

					const act4 = new Tween({})
						.onStart(() => {})
						.to({}, 500)
						.onComplete(() => (actionState.isPerformingAction = false));

					act1.chain(act2);
					act2.chain(act3);
					act3.chain(act4);

					// Start performing action from act1
					act1.start();
				},
		},

		attackStatsTable: new Map<string, number>([['attack', 5]]),

		// This command will generate dynamic base on the hero job
		heroCommand: {
			text: 'Defense',
			onSelect: (hero: Hero) => {
				console.log('Defense');
			},
		},
	},
	wizard: {
		name: 'wizard',
		animations: {
			['idle-left']: {
				frames: [8, 9, 10, 11, 12, 13],
				texture: 'wizard',
				interval: 4,
				looping: true,
			},
			['run-left']: {
				frames: [0, 1, 2, 3, 4, 5, 6, 7],
				texture: 'wizard',
				interval: 4,
				looping: true,
			},
			['attack-left-1']: {
				frames: [32, 33, 34, 35, 36, 37],
				texture: 'wizard',
				interval: 4,
				looping: true,
			},
			['cast-left-1']: {
				frames: [40, 41, 42, 43, 44, 45],
				texture: 'wizard',
				interval: 4,
				looping: true,
			},
			['hurt-left']: {
				frames: [16, 17, 18, 19],
				texture: 'wizard',
				interval: 4,
				looping: true,
			},
			['death-left']: {
				frames: [24, 25, 26, 27],
				texture: 'wizard',
				interval: 4,
				looping: false,
			},
			['victory-left']: {
				frames: [34],
				texture: 'wizard',
				interval: 0,
				looping: false,
			},
		},
		HP: 0,
		baseHP: 6,
		baseAttack: 1,
		baseDefense: 5,
		baseSpeed: 3,
		baseIntelligent: 8,
		HPIV: 3,
		attackIV: 4,
		intelligentIV: 6,
		defenseIV: 2,
		speedIV: 3,
		x: 0,
		y: 0,
		width: 16,
		height: 16,
		renderOffSetX: -42,
		renderOffSetY: -40,
		moveSet: {
			['attack']: (hero, enemy) =>
				function (actionState) {
					// Action Start
					actionState.isPerformingAction = true;
					if (!hero.isAlive || !enemy.isAlive) {
						actionState.isPerformingAction = false;
						return;
					}

					const act1 = new Tween(hero)
						.onStart(() => {
							hero.changeState('run');
						})
						.to({ x: hero.x - 18 }, 150)
						.onComplete(() => {});

					const act2 = new Tween(hero)
						.onStart(() => {
							hero.changeState('attack');
							// Instead creating the new class for changing Animation just set the Animation
							enemy.setAnimation = 'hurt-' + enemy.direction;
						})
						.to({}, 500)
						.onComplete();

					const act3 = new Tween(hero)
						.onStart(() => {
							hero.changeState('run');

							// Here performing the battle calculation
							hero.calculateAttack('attack', enemy);
							if (enemy.isAlive) {
								enemy.setAnimation = 'idle-' + enemy.direction;
							} else {
								enemy.setAnimation = 'death-' + enemy.direction;
							}
						})
						.to({ x: hero.x }, 150)
						.onComplete(() => {
							// Action Finished
							hero.changeState('idle');
						});

					const act4 = new Tween({})
						.onStart(() => {})
						.to({}, 500)
						.onComplete(() => (actionState.isPerformingAction = false));

					act1.chain(act2);
					act2.chain(act3);
					act3.chain(act4);

					// Start performing action from act1
					act1.start();
				},
		},

		attackStatsTable: new Map<string, number>([['attack', 5]]),

		// This command will generate dynamic base on the hero job
		heroCommand: {
			text: 'Magic',
			onSelect: (hero: Hero) => {
				console.log('Black Magic');
			},
		},
	},
};

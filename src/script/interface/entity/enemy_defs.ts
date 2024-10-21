import { Tween } from '@/global';
import { EnemyDef } from '@/script/interface/entity/EnemyDef';

export const ENEMY_DEFS: { [key: string]: EnemyDef } = {
	orc: {
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
				looping: false,
				stopAtFinish: true,
			},
		},
		HP: 10,
		baseHP: 20,
		baseAttack: 2,
		baseDefense: 1,
		baseSpeed: 1,
		HPIV: 1,
		attackIV: 1,
		defenseIV: 1,
		speedIV: 1,
		x: 0,
		y: 0,
		width: 16,
		height: 16,
		renderOffSetX: -42,
		renderOffSetY: -40,
		moveSet: {
			['attack']: (enemy, hero) =>
				function (enemyActionState) {
					enemyActionState.isPerformingAction = true;
					if (!hero.isAlive || !enemy.isAlive) {
						enemyActionState.isPerformingAction = false;
						return;
					}

					const act1 = new Tween(enemy)
						.onStart(() => {
							// Action Start
							enemyActionState.isPerformingAction = true;
							enemy.changeState('run');
						})
						.to({ x: enemy.x + 18 }, 150)
						.onComplete(() => {});

					const act2 = new Tween(enemy)
						.onStart(() => {
							enemy.changeState('attack');
							// Instead creating the new class for changing Animation just set the Animation
							hero.setAnimation = 'hurt-' + hero.direction;
						})
						.to({}, 500)
						.onComplete();

					const act3 = new Tween(enemy)
						.onStart(() => {
							hero.changeState('run');

							// Here performing the battle calculation
							enemy.calculateAttack('attack', hero);
							if (hero.isAlive) {
								hero.setAnimation = 'idle-' + hero.direction;
							} else {
								hero.setAnimation = 'death-' + hero.direction;
							}
						})
						.to({ x: enemy.x }, 150)
						.onComplete(() => {
							// Action Finished
							enemy.changeState('idle');
						});

					const act4 = new Tween({})
						.onStart(() => {})
						.to({}, 500)
						.onComplete(() => (enemyActionState.isPerformingAction = false));

					act1.chain(act2);
					act2.chain(act3);
					act3.chain(act4);

					// Start performing action from act1
					act1.start();
				},
		},
		attackStatsTable: new Map([['attack', 1]]),
		exp: 5,
	},
	skeleton: {
		name: 'skeleton',
		animations: {
			['idle-right']: {
				frames: [0, 1, 2, 3, 4, 5],
				texture: 'skeleton',
				interval: 4,
				looping: true,
			},
			['run-right']: {
				frames: [8, 9, 10, 11, 12, 13, 14, 15],
				texture: 'skeleton',
				interval: 4,
				looping: true,
			},
			['attack-right-1']: {
				frames: [16, 17, 18, 19, 20, 21],
				texture: 'skeleton',
				interval: 4,
				looping: true,
			},
			['attack-right-2']: {
				frames: [24, 25, 26, 27, 28, 29, 30],
				texture: 'skeleton',
				interval: 4,
				looping: true,
			},
			['hurt-right']: {
				frames: [40, 41, 42, 43],
				texture: 'skeleton',
				interval: 4,
				looping: true,
			},
			['death-right']: {
				frames: [48, 49, 50, 51],
				texture: 'skeleton',
				interval: 4,
				looping: false,
				stopAtFinish: true,
			},
		},
		HP: 10,
		baseHP: 20,
		baseAttack: 2,
		baseDefense: 1,
		baseSpeed: 1,
		HPIV: 1,
		attackIV: 1,
		defenseIV: 1,
		speedIV: 1,
		x: 0,
		y: 0,
		width: 16,
		height: 16,
		renderOffSetX: -42,
		renderOffSetY: -40,
		moveSet: {
			['attack']: (enemy, hero) =>
				function (enemyActionState) {
					enemyActionState.isPerformingAction = true;
					if (!hero.isAlive || !enemy.isAlive) {
						enemyActionState.isPerformingAction = false;
						return;
					}

					const act1 = new Tween(enemy)
						.onStart(() => {
							// Action Start
							enemyActionState.isPerformingAction = true;
							enemy.changeState('run');
						})
						.to({ x: enemy.x + 18 }, 150)
						.onComplete(() => {});

					const act2 = new Tween(enemy)
						.onStart(() => {
							enemy.changeState('attack');
							// Instead creating the new class for changing Animation just set the Animation
							hero.setAnimation = 'hurt-' + hero.direction;
						})
						.to({}, 500)
						.onComplete();

					const act3 = new Tween(enemy)
						.onStart(() => {
							hero.changeState('run');

							// Here performing the battle calculation
							enemy.calculateAttack('attack', hero);
							if (hero.isAlive) {
								hero.setAnimation = 'idle-' + hero.direction;
							} else {
								hero.setAnimation = 'death-' + hero.direction;
							}
						})
						.to({ x: enemy.x }, 150)
						.onComplete(() => {
							// Action Finished
							enemy.changeState('idle');
						});

					const act4 = new Tween({})
						.onStart(() => {})
						.to({}, 500)
						.onComplete(() => (enemyActionState.isPerformingAction = false));

					act1.chain(act2);
					act2.chain(act3);
					act3.chain(act4);

					// Start performing action from act1
					act1.start();
				},
		},
		attackStatsTable: new Map([['attack', 1]]),
		exp: 5,
	},
};

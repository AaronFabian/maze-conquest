import { Tween } from '@/global';
import { ItemObjectDef, ItemType } from '@/script/interface/object/ItemObjectDef';
import { Hero } from '@/script/object/party/Hero';
import { ActionState } from '@/script/state/game/ActionState';
import { DialogueState } from '@/script/state/game/DialogueState';
import { FadeInState } from '@/script/state/game/FadeInState';
import { FadeOutState } from '@/script/state/game/FadeOutState';
import { GameState } from '@/script/state/game/GameState';
import { UserUseItemState } from '@/script/state/game/UserUseItemState';
import { User } from '@/script/system/model/User';
import { Town } from '@/script/world/Town';
import { World, WorldType } from '@/script/world/World';

const _window = window as any;

export const ITEM_OBJECT_DEFS: { [key: string]: ItemObjectDef } = {
	['phoenix-feather']: {
		id: 1,
		key: 'phoenix-feather',
		name: 'Phoenix Feather',
		type: ItemType.Miracle,
		description:
			"Escape from wrath of Maze. Phoenix is a calamity creature that rule the space. Phoenix is symbol of safe. Just using it's feather will transport magically to safety place. In this case back to nearby Town",
		effect(args, _): boolean {
			if (!(args.state instanceof GameState)) throw new Error('Unexpected behavior while using Phoenix Feather');

			const state = args.state as GameState;
			const user = args.user as User;

			if (state.level instanceof Town) {
				_window.gStateStack.pop(); // PauseState
				_window.gStateStack.push(
					new DialogueState(state.level, 'You cannot use this item inside the Town.', () => _window.gStateStack.pop())
				);
				return false;
			}

			const quantity = user.items.get('phoenix-feather');
			if (quantity === undefined) throw new Error('Unexpected behavior while using item. Undefined Phoenix Feather');
			if (quantity - 1 < 0) {
				// Nothing happen; Just play the sound
				return false;
			}

			// Valid ✅
			_window.gStateStack.pop(); // PauseState

			user.items.set('phoenix-feather', quantity - 1);

			_window.gStateStack.push(
				new FadeInState({ r: 0, g: 0, b: 0 }, 1500, () => {
					// Do another stuff here if needed
					// ...

					// 01 Reset the reference
					state.setWorld = WorldType.Town;
					state.player.level = state.level;
					state.level.setup();

					// 02 Slightly tweak to make Player looks waiting the FadeOutState
					state.player.changeState('idle');

					// 03
					_window.gStateStack.push(new FadeOutState({ r: 0, g: 0, b: 0 }, 1500, () => {}));
				})
			);

			console.log(`Using phoenix wing to escape maze`);
			return true;
		},
	},
	['potion']: {
		id: 2,
		key: 'potion',
		name: 'Potion',
		description: 'A regular Potion. Restore 50 health points',
		type: ItemType.BattleItem,
		effect(args, caster): boolean {
			const user = args.user as User;

			if (args.state instanceof ActionState) {
				const state = args.state as ActionState;
				const target = args.target as Hero;

				// Start action
				state.isPerformingAction = true;

				// When at ActionState, caster required !
				if (caster === undefined) throw new Error("Undefined param 'caster'.");

				// Get user current data
				const quantity = user.items.get('potion');
				if (quantity === undefined) throw new Error('Unexpected behavior while using item. Undefined Potion');
				if (quantity - 1 < 0) throw new Error('Unexpected behavior while using item. Item below 0');

				const act1 = new Tween(caster)
					.onStart(() => {
						// Action Start
						caster.changeState('run');
					})
					.to({ x: caster.x - 18 }, 150)
					.onComplete(() => {});

				const act2 = new Tween(caster)
					.onStart(() => {
						caster.changeState('idle');
						caster.setAnimation = 'victory-left';
					})
					.to({}, 500)
					.onComplete();

				const act3 = new Tween(caster)
					.onStart(() => {
						caster.changeState('run');
					})
					.to({ x: caster.x }, 150)
					.onComplete(() => {
						caster.changeState('idle');

						console.log(`[System Log] ${caster.name} using Potion!`);
						if (target.currentHP === target.HP) {
							console.log(`[System Log] ${target.name} HP is full!`);
							user.items.set('potion', quantity - 1);
							state.isPerformingAction = false;
							return true;
						}

						if (target.currentHP + 50 > target.HP) {
							const healedPoints = target.HP - target.currentHP;
							target.currentHP = target.HP;
							console.log(`[System Log] ${target.name} HP healed by ${healedPoints} points!`);
						} else {
							target.currentHP += 50;
							console.log(`[System Log] ${target.name} HP healed by 50 points!`);
						}

						// Reduce user quantity
						user.items.set('potion', quantity - 1);

						// Action Finished
						state.isPerformingAction = false;
					});

				act1.chain(act2);
				act2.chain(act3);

				// Start performing action from act1
				act1.start();

				return true;
			}

			if (args.state instanceof GameState) {
				const state = args.state as GameState;

				const quantity = user.items.get('potion');
				if (quantity === undefined) throw new Error('Unexpected behavior while using item. Undefined Potion');
				if (quantity - 1 < 0)
					// Nothing happen; Just play the sound
					return false;

				if (state !== null && state.level instanceof World) {
					_window.gStateStack.push(
						new UserUseItemState(state.user, 'potion', (selected: Hero) => {
							_window.gStateStack.pop();

							console.log(`[System Log] ${selected.name} using Potion!`);
							if (selected.currentHP === selected.HP) {
								console.log(`[System Log] ${selected.name} HP is full!`);
								_window.gStateStack.push(
									new DialogueState(state.level, `${selected.name} HP is full!`, () => _window.gStateStack.pop())
								);
								return;
							}

							if (selected.currentHP + 50 > selected.HP) {
								const healedPoints = selected.HP - selected.currentHP;
								selected.currentHP = selected.HP;
								console.log(`[System Log] ${selected.name} HP healed by ${healedPoints} points!`);
							} else {
								selected.currentHP += 50;
								console.log(`[System Log] ${selected.name} HP healed by 50 points!`);
							}
							user.items.set('potion', quantity - 1);
							return true;
						})
					);

					throw new Error('Unexpected error while using item');
				}
			}

			throw new Error('Unexpected error while using item');
		},
	},
	['hi-potion']: {
		id: 3,
		key: 'hi-potion',
		name: 'Hi Potion',
		description: 'Upgraded version of Potion. Restore 250 health points',
		type: ItemType.BattleItem,
		effect(args, caster): boolean {
			const user = args.user as User;

			if (args.state instanceof ActionState) {
				const state = args.state as ActionState;
				const target = args.target as Hero;

				// Start action
				state.isPerformingAction = true;

				// When at ActionState, caster required !
				if (caster === undefined) throw new Error("Undefined param 'caster'.");

				// Get user current data
				const quantity = user.items.get('hi-potion');
				if (quantity === undefined) throw new Error('Unexpected behavior while using item. Undefined Hi Potion');
				if (quantity - 1 < 0) throw new Error('Unexpected behavior while using item. Item below 0');

				const act1 = new Tween(caster)
					.onStart(() => {
						// Action Start
						caster.changeState('run');
					})
					.to({ x: caster.x - 18 }, 150)
					.onComplete(() => {});

				const act2 = new Tween(caster)
					.onStart(() => {
						caster.changeState('idle');
						caster.setAnimation = 'victory-left';
					})
					.to({}, 500)
					.onComplete();

				const act3 = new Tween(caster)
					.onStart(() => {
						caster.changeState('run');
					})
					.to({ x: caster.x }, 150)
					.onComplete(() => {
						caster.changeState('idle');

						console.log(`[System Log] ${caster.name} using Hi Potion!`);
						if (target.currentHP === target.HP) {
							console.log(`[System Log] ${target.name} HP is full!`);
							user.items.set('hi-potion', quantity - 1);
							state.isPerformingAction = false;
							return true;
						}

						if (target.currentHP + 250 > target.HP) {
							const healedPoints = target.HP - target.currentHP;
							target.currentHP = target.HP;
							console.log(`[System Log] ${target.name} HP healed by ${healedPoints} Hi Potion!`);
						} else {
							target.currentHP += 250;
							console.log(`[System Log] ${target.name} HP healed by 250 Hi Potion!`);
						}

						// Reduce user quantity
						user.items.set('hi-potion', quantity - 1);

						// Action Finished
						state.isPerformingAction = false;
					});

				act1.chain(act2);
				act2.chain(act3);

				// Start performing action from act1
				act1.start();

				return true;
			}

			if (args.state instanceof GameState) {
				const state = args.state as GameState;

				const quantity = user.items.get('hi-potion');
				if (quantity === undefined) throw new Error('Unexpected behavior while using item. Undefined Hi Potion');
				if (quantity - 1 < 0)
					// Nothing happen; Just play the sound
					return false;

				if (state !== null && state.level instanceof World) {
					_window.gStateStack.push(
						new UserUseItemState(state.user, 'hi-potion', (selected: Hero) => {
							_window.gStateStack.pop();

							console.log(`[System Log] ${selected.name} using Hi Potion!`);
							if (selected.currentHP === selected.HP) {
								console.log(`[System Log] ${selected.name} HP is full!`);
								_window.gStateStack.push(
									new DialogueState(state.level, `${selected.name} HP is full!`, () => _window.gStateStack.pop())
								);
								return;
							}

							if (selected.currentHP + 250 > selected.HP) {
								const healedPoints = selected.HP - selected.currentHP;
								selected.currentHP = selected.HP;
								console.log(`[System Log] ${selected.name} HP healed by ${healedPoints} points!`);
							} else {
								selected.currentHP += 250;
								console.log(`[System Log] ${selected.name} HP healed by 250 points!`);
							}

							user.items.set('hi-potion', quantity - 1);
							return true;
						})
					);

					throw new Error('Unexpected error while using item');
				}
			}

			throw new Error('Unexpected error while using item');
		},
	},
};

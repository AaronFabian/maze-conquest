import { ItemObjectDef, ItemType } from '@/script/interface/object/ItemObjectDef';
import { Hero } from '@/script/object/party/Hero';
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
			const state = args.state as GameState;
			const user = args.user as User;

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
					})
				);

				return true;
			}

			// Normal use while in battle
			if (caster === undefined) throw new Error("Undefined param 'caster'.");

			console.log(`${caster.name} using Potion!`);
			if (caster.currentHP + 50 > caster.HP) {
				const healedPoints = caster.currentHP + 50 - caster.HP;
				caster.currentHP = caster.HP;
				console.log(`${caster.name} HP healed by ${healedPoints} points!`);
			} else {
				caster.currentHP += 50;
				console.log(`${caster.name} HP healed by 50 points!`);
			}

			return true;
		},
	},
	['hi-potion']: {
		id: 3,
		key: 'hi-potion',
		name: 'Hi Potion',
		description: 'Upgraded version of Potion. Restore 250 health points',
		type: ItemType.BattleItem,
		effect(args, caster): boolean {
			const state: GameState | null = args.state as GameState;
			const user = args.user as User;

			const quantity = user.items.get('potion');
			if (quantity === undefined) throw new Error('Unexpected behavior while using item. Undefined hi-potion');
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
					})
				);

				return true;
			}

			// Normal use while in battle
			if (caster === undefined) throw new Error("Undefined param 'caster'.");

			console.log(`${caster.name} using Potion!`);
			if (caster.currentHP + 250 > caster.HP) {
				const healedPoints = caster.currentHP + 250 - caster.HP;
				caster.currentHP = caster.HP;
				console.log(`${caster.name} HP healed by ${healedPoints} points!`);
			} else {
				caster.currentHP += 250;
				console.log(`${caster.name} HP healed by 250 points!`);
			}

			return true;
		},
	},
};

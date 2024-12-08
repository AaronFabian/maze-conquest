import { canvas } from '@/global';
import { HeroMoveMenu } from '@/script/gui/HeroMoveMenu';
import { HERO_DEFS } from '@/script/interface/entity/hero_defs';
import { Hero } from '@/script/object/party/Hero';
import { BaseState } from '@/script/state/BaseState';
import { ActionState } from '@/script/state/game/ActionState';
import { BattleInformationState } from '@/script/state/game/BattleInformationState';
import { BattleState } from '@/script/state/game/BattleState';
import { EnemyActionState } from '@/script/state/game/EnemyActionState';
import { SelectEnemyPartyState } from '@/script/state/game/SelectEnemyPartyState';
import { SystemError } from '@/script/system/error/SystemError';

const _window = window as any;

export class SelectionState extends BaseState {
	battleState: BattleState;
	battleInformationState: BattleInformationState;
	menu: HeroMoveMenu;
	turnStack: Hero[];
	moveStackHistory: Hero[];
	moveStack: Array<(s: ActionState) => void>;
	constructor(battleInformationState: BattleInformationState) {
		super();

		// 01 Save the reference
		this.battleInformationState = battleInformationState;
		this.battleState = this.battleInformationState.battleState;

		// 02 Determine who is the fastest, the fastest Hero then go to the stack first
		this.turnStack = this.determineTurnStack();
		// In case Player press the cancel button then we have history
		this.moveStackHistory = [];
		// Save callback for later turn move
		this.moveStack = [];

		// 03 This will highlight which hero currently give command at InformationState
		this.battleInformationState.highLight = this.battleState.heroParty.party.indexOf(this.currentHeroTurn);

		// 04 Create move menu
		this.menu = this.generateHeroMoveMenu();
	}

	nextQueue() {
		if (this.turnStack.length === 0) throw new SystemError('Unexpected behavior while next queue the turn stack');

		// 01 Remove the first element of then send them to moveStackHistory;
		this.moveStackHistory.push(this.turnStack.shift()!);

		// 02 Find the hero for current turn, get it by reference
		const idx = this.battleState.heroParty.findHeroIndex(this.turnStack[0]);
		if (idx === -1) throw new SystemError('Unexpected behavior while finding the hero party by reference');
		this.battleInformationState.highLight = idx;

		// 03
		this.menu = this.generateHeroMoveMenu();
	}

	private generateHeroMoveMenu(): HeroMoveMenu {
		return new HeroMoveMenu(canvas.width / 2 + 60 + 3, canvas.height / 2 - 240 / 2 + 260, 120, 84, [
			{
				text: 'Attack',
				onSelect: () => {
					_window.gStateStack.push(
						new SelectEnemyPartyState(this.currentHeroTurn, this.battleState, enemy => {
							this.battleInformationState.highLight = null;
							this.moveStack.push(this.currentHeroTurn.moveSet['attack'](this.currentHeroTurn, enemy));

							// If there is only one then stop next turn and go to ActionState
							if (this.turnStack.length === 1) {
								// * The Action state starting point

								// Remove SelectEnemyPartyState
								_window.gStateStack.pop();

								// Remove selection state
								_window.gStateStack.pop();

								if (this.battleState.firstTurn === this.battleState.heroParty) {
									_window.gStateStack.push(new EnemyActionState(this.battleState));
									_window.gStateStack.push(new ActionState(this.battleState, this.moveStack));
								} else {
									_window.gStateStack.push(new ActionState(this.battleState, this.moveStack));
									_window.gStateStack.push(new EnemyActionState(this.battleState));
								}

								// Reset the turn, This will be generated again when InformationState updated again
								this.reset();
							} else {
								_window.gStateStack.pop();
								this.nextQueue();
							}
						})
					);
				},
			},
			{
				// This is hero special move; summary: every turn this command will be different
				text: HERO_DEFS[this.currentHeroTurn.name].heroCommand.text,
				onSelect: () => {
					HERO_DEFS[this.currentHeroTurn.name].heroCommand.onAction(this.currentHeroTurn);
				},
			},
			{
				text: 'Items',
				onSelect: () => {
					// const state = new ShowItemDrawerState(this.battleState.user, 0, 0, selected => {
					// 	_window.gStateStack.pop();
					// 	// this.moveStack.push((actionState) => selected.effect({ state: null, user: this.battleState.user }, this.turnStack[0]));
					// 	_window.gStateStack.push(new SelectPartyState());
					// 	// TODO: We need to refactor that SelectionState should be have method that can determine this turn already done or not
					// });
					// // state.setFilterCategory = [];
					// gStateStack.push(state);
				},
			},
			{
				text: 'Run',
				onSelect: () => {
					console.log('Run');
				},
			},
		]);
	}

	private determineTurnStack(): Hero[] {
		const turnStack = [];
		for (let i = 0; i < this.battleState.heroParty.length; i++) {
			const hero = this.battleState.heroParty.party[i] as Hero;
			if (!hero.isAlive) continue;

			// If no hero yet in the stack
			if (turnStack.length === 0) {
				turnStack.push(hero);
				continue;
			}

			// Push the new hero to turnStack and then sort by DESC by their speed
			turnStack.push(hero);
			turnStack.sort((prevHero, currentHero) => currentHero.speed - prevHero.speed);
		}

		return turnStack;
	}

	private reset() {
		this.moveStack = [];
		this.battleState.firstTurn = null;
		this.battleState.secondTurn = null;
	}

	get currentHeroTurn() {
		return this.turnStack[0];
	}

	override update() {
		this.battleState.update();
		this.menu.update();
	}

	override render() {
		this.menu.render();
	}
}

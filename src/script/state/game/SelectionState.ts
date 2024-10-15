import { canvas } from '@/global';
import { HeroMoveMenu } from '@/script/gui/HeroMoveMenu';
import { Hero } from '@/script/object/party/Hero';
import { BaseState } from '@/script/state/BaseState';
import { BattleInformationState } from '@/script/state/game/BattleInformationState';
import { BattleState } from '@/script/state/game/BattleState';
import { SystemError } from '@/script/world/Error/SystemError';

const _window = window as any;

export class SelectionState extends BaseState {
	battleState: BattleState;
	battleInformationState: BattleInformationState;
	menu: HeroMoveMenu;
	turnStack: Hero[];
	stackHistory: Hero[];
	constructor(battleState: BattleState, battleInformationState: BattleInformationState) {
		super();

		// 01 Save the reference
		this.battleState = battleState;
		this.battleInformationState = battleInformationState;

		// 02 Determine who is the fastest, the fastest Hero then go to the stack first
		this.turnStack = this.determineTurnStack();
		// In case Player press the cancel button then we have history
		this.stackHistory = [];

		// 03 This will highlight which hero currently give command at InformationState
		this.battleInformationState.highLight = this.battleState.heroParty.party.indexOf(this.turnStack[0]);

		this.menu = new HeroMoveMenu(
			this,
			this.turnStack[0],
			canvas.width / 2 + 60 + 3,
			canvas.height / 2 - 240 / 2 + 260,
			120,
			84,
			[
				{
					text: 'Attack',
					onSelect: () => console.log('attack 1'),
				},
				{
					text: 'Defense',
					onSelect: () => {},
				},
				{
					text: 'Items',
					onSelect: () => {},
				},
				{
					text: 'Run',
					onSelect: () => {},
				},
			]
		);
	}

	nextQueue() {
		if (this.turnStack.length === 0) throw new SystemError('Unexpected behavior while next queue the turn stack');

		// Remove the first element of then send them to stackHistory;
		this.stackHistory.push(this.turnStack.shift()!);

		this.battleInformationState.highLight = this.battleState.heroParty.party.indexOf(this.turnStack[0]);

		this.menu = new HeroMoveMenu(
			this,
			this.turnStack[0],
			canvas.width / 2 + 60 + 3,
			canvas.height / 2 - 240 / 2 + 260,
			120,
			84,
			[
				{
					text: 'Attack',
					onSelect: () => console.log('attack 2'),
				},
				{
					text: 'Defense',
					onSelect: () => {},
				},
				{
					text: 'Items',
					onSelect: () => {},
				},
				{
					text: 'Run',
					onSelect: () => {},
				},
			]
		);
	}

	private determineTurnStack(): Hero[] {
		const turnStack = [];
		for (let i = 0; i < this.battleState.heroParty.length; i++) {
			const hero = this.battleState.heroParty.party[i] as Hero;

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

	override update() {
		this.battleState.update();
		this.menu.update();
	}

	override render() {
		this.menu.render();
	}
}

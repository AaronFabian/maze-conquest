import { canvas, Tween } from '@/global';
import { HeroMoveMenu } from '@/script/gui/HeroMoveMenu';
import { Hero } from '@/script/object/party/Hero';
import { BaseState } from '@/script/state/BaseState';
import { BattleInformationState } from '@/script/state/game/BattleInformationState';
import { BattleState } from '@/script/state/game/BattleState';
import { SystemError } from '@/script/world/Error/SystemError';
import { ActionState } from '@/script/state/game/ActionState';
import { HERO_DEFS } from '@/script/interface/entity/hero_defs';
import { SelectEnemyPartyState } from './SelectEnemyPartyState';

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
		this.battleInformationState.highLight = this.battleState.heroParty.party.indexOf(this.turnStack[0]);

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
		const currentHero = this.turnStack[0];
		return new HeroMoveMenu(this, currentHero, canvas.width / 2 + 60 + 3, canvas.height / 2 - 240 / 2 + 260, 120, 84, [
			{
				text: 'Attack',
				onSelect: (hero, battleState, selectionState) => {
					const _window = window as any;
					_window.gStateStack.push(new SelectEnemyPartyState(hero, 'attack', battleState, selectionState));
				},
			},
			HERO_DEFS[this.turnStack[0].name].heroCommand,
			{
				text: 'Items',
				onSelect: (hero: Hero) => {
					console.log('Items');
				},
			},
			{
				text: 'Run',
				onSelect: (hero: Hero) => {
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

	override update() {
		this.battleState.update();
		this.menu.update();
	}

	override render() {
		this.menu.render();
	}
}

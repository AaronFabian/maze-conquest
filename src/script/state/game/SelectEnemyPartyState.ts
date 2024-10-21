import { ctx } from '@/global';
import { keyWasPressed } from '@/index';
import { Textbox } from '@/script/gui/Textbox';
import { Enemy } from '@/script/object/party/Enemy';
import { Hero } from '@/script/object/party/Hero';
import { BaseState } from '@/script/state/BaseState';
import { ActionState } from '@/script/state/game/ActionState';
import { BattleState } from '@/script/state/game/BattleState';
import { EnemyActionState } from '@/script/state/game/EnemyActionState';
import { SelectionState } from '@/script/state/game/SelectionState';

const _window = window as any;

export class SelectEnemyPartyState extends BaseState {
	battleState: BattleState;
	textbox: Textbox;
	counter: number;
	selectedEnemy: Enemy;
	selectionState: SelectionState;
	performer: Hero;
	selectedMove: string;
	constructor(performer: Hero, selectedMove: string, battleState: BattleState, selectionState: SelectionState) {
		super();
		this.battleState = battleState;
		this.selectionState = selectionState;
		this.performer = performer;
		this.selectedMove = selectedMove;

		this.counter = 0;
		this.selectedEnemy = this.battleState.enemyParty.party[this.counter] as Enemy;

		// We don't care about where the panel should be render at the first time
		this.textbox = this.generateTextbox();
	}

	private generateTextbox() {
		ctx.font = 'zig 14px';
		const metrics: TextMetrics = ctx.measureText(this.selectedEnemy.name);
		const textTotalWidth: number = metrics.width;
		const textbox = new Textbox(0, 0, textTotalWidth + 10, 26, this.selectedEnemy.name, 'zig 14px');
		textbox.setX = this.selectedEnemy.x - textbox.width - 12;
		textbox.setY = this.selectedEnemy.y;

		return textbox;
	}

	override update() {
		this.battleState.update();

		// If player press b then back to SelectionState
		if (keyWasPressed('b')) {
			_window.gStateStack.pop();
		}

		// Performance efficiency and prevent weird rendering behavior
		if (this.battleState.enemyParty.length > 1) {
			if (keyWasPressed('w')) {
				if (this.counter - 1 < 0) {
					this.counter = this.battleState.enemyParty.length - 1;
				} else {
					this.counter--;
				}

				// TODO: Fix where Player should not choose the not alive enemy
				this.selectedEnemy = this.battleState.enemyParty.party[this.counter] as Enemy;
				this.textbox = this.generateTextbox();
			} else if (keyWasPressed('s')) {
				if (this.counter + 1 > this.battleState.enemyParty.length - 1) {
					this.counter = 0;
				} else {
					this.counter++;
				}

				this.selectedEnemy = this.battleState.enemyParty.party[this.counter] as Enemy;
				this.textbox = this.generateTextbox();
			}
		}

		// If the Enter key pressed that mean the Player have been make a choice
		if (keyWasPressed('Enter')) {
			if (this.selectedEnemy.isAlive) {
				this.selectionState.moveStack.push(this.performer.moveSet['attack'](this.performer, this.selectedEnemy));

				// If there is only one then stop next turn and go to ActionState
				if (this.selectionState.turnStack.length === 1) {
					// Remove this state
					_window.gStateStack.pop();

					// Remove selection state
					_window.gStateStack.pop();

					if (this.battleState.firstTurn === this.battleState.heroParty) {
						_window.gStateStack.push(new EnemyActionState(this));
						_window.gStateStack.push(new ActionState(this.battleState, this.selectionState));
					} else {
						_window.gStateStack.push(new ActionState(this.battleState, this.selectionState));
						_window.gStateStack.push(new EnemyActionState(this));
					}

					// Reset the turn, This will be generated again when InformationState updated again
					this.battleState.firstTurn = null;
					this.battleState.secondTurn = null;
				} else {
					_window.gStateStack.pop();
					this.selectionState.nextQueue();
				}
			} else {
				// Play sound
			}
		}
	}

	override render() {
		this.textbox.render();
	}
}

import { ctx } from '@/global';
import { keyWasPressed } from '@/index';
import { Textbox } from '@/script/gui/Textbox';
import { Enemy } from '@/script/object/party/Enemy';
import { Hero } from '@/script/object/party/Hero';
import { BaseState } from '@/script/state/BaseState';
import { BattleState } from '@/script/state/game/BattleState';

const _window = window as any;

export class SelectEnemyPartyState extends BaseState {
	battleState: BattleState;
	textbox: Textbox;
	counter: number;
	selectedEnemy: Enemy;
	performer: Hero;
	onSelectedEnemy: (selected: Enemy) => void;
	constructor(performer: Hero, battleState: BattleState, onSelectedEnemy: (selected: Enemy) => void) {
		super();
		this.battleState = battleState;
		this.performer = performer;

		this.counter = 0;
		this.selectedEnemy = this.battleState.enemyParty.party[this.counter] as Enemy;

		// We don't care about where the panel should be render at the first time
		this.textbox = this.generateTextbox();
		this.onSelectedEnemy = onSelectedEnemy;
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
		if (keyWasPressed(' ')) {
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
				this.onSelectedEnemy(this.selectedEnemy);
			} else {
				// Play sound that tell player you could not choose this enemy because the enemy K'O
			}
		}
	}

	override render() {
		this.textbox.render();
	}
}

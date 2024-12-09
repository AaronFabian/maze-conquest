import { ctx } from '@/global';
import { keyWasPressed } from '@/index';
import { Textbox } from '@/script/gui/Textbox';
import { Entity } from '@/script/object/entity/Entity';
import { Hero } from '@/script/object/party/Hero';
import { BaseState } from '@/script/state/BaseState';
import { BattleState } from '@/script/state/game/BattleState';

const _window = window as any;

export class SelectPartyState extends BaseState {
	performer: Hero;
	battleState: BattleState;
	onSelected: (target: Entity) => void;
	cursor: number;
	selectedTarget: Hero;
	textbox: Textbox;
	constructor(performer: Hero, battleState: BattleState, onSelected: (target: Entity) => void) {
		super();
		this.performer = performer;
		this.battleState = battleState;
		this.onSelected = onSelected;

		this.cursor = 0;
		this.selectedTarget = this.battleState.heroParty.party[this.cursor] as Hero;

		this.textbox = this.generateTextbox();
	}

	private generateTextbox() {
		ctx.font = 'zig 14px';
		const metrics: TextMetrics = ctx.measureText(this.selectedTarget.name);
		const textTotalWidth: number = metrics.width;
		const textbox = new Textbox(0, 0, textTotalWidth + 10, 26, this.selectedTarget.name, 'zig 14px');
		textbox.setX = this.selectedTarget.x - textbox.width - 12;
		textbox.setY = this.selectedTarget.y;

		return textbox;
	}

	override update() {
		this.battleState.update();

		if (keyWasPressed(' ')) _window.gStateStack.pop();

		// Performance efficiency and prevent weird rendering behavior
		if (this.battleState.enemyParty.length > 1) {
			if (keyWasPressed('w')) {
				if (this.cursor - 1 < 0) {
					this.cursor = this.battleState.enemyParty.length - 1;
				} else {
					this.cursor--;
				}

				// TODO: Fix where Player should not choose the not alive enemy
				this.selectedTarget = this.battleState.heroParty.party[this.cursor] as Hero;
				this.textbox = this.generateTextbox();
			} else if (keyWasPressed('s')) {
				if (this.cursor + 1 > this.battleState.heroParty.length - 1) {
					this.cursor = 0;
				} else {
					this.cursor++;
				}

				this.selectedTarget = this.battleState.heroParty.party[this.cursor] as Hero;
				this.textbox = this.generateTextbox();
			}
		}

		if (keyWasPressed('Enter')) {
			if (this.selectedTarget.isAlive) {
				this.onSelected(this.selectedTarget);
			} else {
				// Play sound that tell player you could not choose this enemy because the enemy K'O
			}
		}
	}

	override render() {
		this.textbox.render();
	}
}

import { canvas } from '@/global';
import { Textbox } from '@/script/gui/Textbox';
import { BaseState } from '@/script/state/BaseState';
import { BattleState } from '@/script/state/game/BattleState';

export class BattleNatatorState extends BaseState {
	battleState: BattleState;
	textbox: Textbox;
	constructor(battleState: BattleState) {
		super();

		this.battleState = battleState;

		// gui
		this.textbox = new Textbox(
			this.battleState.level,
			canvas.width / 2 - 360 / 2,
			canvas.height / 2 - 240 / 2 + 260,
			360,
			84
		);
	}

	override update() {
		this.battleState.heroParty.update();
		this.textbox.update();
	}

	override render() {
		this.battleState.render();
		this.textbox.render();
	}
}

import { canvas, TWEEN } from '@/global';
import { Textbox } from '@/script/gui/Textbox';
import { BaseState } from '@/script/state/BaseState';
import { BattleState } from '@/script/state/game/BattleState';

const _window = window as any;

export class BattleNatatorState extends BaseState {
	battleState: BattleState;
	textbox: Textbox;
	onClose: Function;
	constructor(battleState: BattleState, text: string, onClose: Function = () => {}) {
		super();

		this.battleState = battleState;

		this.onClose = onClose;

		// gui
		this.textbox = new Textbox(canvas.width / 2 - 360 / 2, canvas.height / 2 - 240 / 2 + 260, 360, 84, text);
	}

	override update() {
		this.battleState.heroParty.update();
		this.battleState.enemyParty.update();
		this.textbox.update();
		if (this.textbox.isClosed && !this.textbox.panel.isAnimating) {
			_window.gStateStack.pop();
			this.onClose();
		}
	}

	override render() {
		this.battleState.render();
		this.textbox.render();
	}

	override exit = () => TWEEN.removeAll();
}

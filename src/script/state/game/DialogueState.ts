import { canvas } from '@/global';
import { Textbox } from '@/script/gui/Textbox';
import { BaseState } from '@/script/state/BaseState';
import { World } from '@/script/world/World.js';

/**
 * This is basically almost the same with the BattleNatatorState, but the place where this will render different
 */
export class DialogueState extends BaseState {
	textbox: Textbox;
	world: World;
	lockState: boolean;
	onClose: Function;
	constructor(world: World, text: string, onClose: Function = () => {}) {
		super();

		this.world = world;
		this.onClose = onClose;
		this.lockState = false;

		// gui; slightly different from BattleNatatorState
		this.textbox = new Textbox(canvas.width / 2 - 360 / 2, canvas.height / 2 - 240 / 2 + 260, 360, 64, text);
	}

	override update() {
		if (this.lockState) return;

		this.textbox.update();
		if (this.textbox.isClosed && !this.textbox.panel.isAnimating) {
			this.lockState = true;
			this.onClose();
		}
	}

	override render() {
		this.world.render();
		this.textbox.render();
	}
}

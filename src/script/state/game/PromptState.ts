import { canvas } from '@/global';
import { Prompt, PromptAnswer } from '@/script/gui/Prompt';
import { BaseState } from '@/script/state/BaseState';
import { World } from '@/script/world/World';

const _window = window as any;

/**
 * This state automatically remove when Player answered
 */

export class PromptState extends BaseState {
	prompt: Prompt;
	world: World;
	onYes: () => void;
	onNo: () => void;
	constructor(world: World, { onYes, onNo }: { onYes: () => void; onNo: () => void }) {
		super();
		this.world = world;
		this.onYes = onYes;
		this.onNo = onNo;
		this.prompt = new Prompt(canvas.width / 2 - 180, canvas.height / 2 - 134 + 240, 120, 32);
	}

	override update() {
		this.prompt.update();

		if (this.prompt.isAnswered) {
			_window.gStateStack.pop();

			if (this.prompt.answer === PromptAnswer.Yes) {
				this.onYes();
			} else {
				this.onNo();
			}
		}
	}

	override render() {
		this.prompt.render();
	}
}

import { ctx } from '@/global';
import { Panel } from '@/script/gui/Panel';
import { Prompt, PromptAnswer } from '@/script/gui/Prompt';
import { BaseState } from '@/script/state/BaseState';
import { getWrap } from '@/utils';

const _window = window as any;

/**
 * This state automatically remove when Player answered
 */

export class PromptState extends BaseState {
	prompt: Prompt;
	textChunk: string[];
	onYes: () => void;
	onNo: () => void;
	panel: Panel;
	constructor(
		x: number,
		y: number,
		width: number,
		height: number,
		text: string,
		{ onYes, onNo }: { onYes: () => void; onNo: () => void }
	) {
		super();
		this.onYes = onYes;
		this.onNo = onNo;
		this.textChunk = getWrap(ctx, text, width - 3);
		this.prompt = new Prompt(x, y, width, height);
		this.panel = new Panel(this.prompt.x, this.prompt.y + this.prompt.height - 8, 360, 80);
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
		this.panel.render();
		this.prompt.render();

		ctx.font = '16px zig';
		ctx.fillStyle = 'rgba(255, 255, 255, 1)';
		this.textChunk.forEach((text, index) =>
			ctx.fillText(text, this.prompt.x + 3, this.prompt.y + 34 + 16 * (index + 1))
		);
	}
}

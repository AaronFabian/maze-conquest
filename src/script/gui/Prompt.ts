import { ctx } from '@/global';
import { keyWasPressed } from '@/index';
import { Panel } from '@/script/gui/Panel';
import { CanvasRendering } from '@/script/interface/state/CanvasRendering';

export enum PromptAnswer {
	Yes,
	No,
}

export class Prompt implements CanvasRendering {
	x: number;
	y: number;
	width: number;
	height: number;
	panel: Panel;
	answer: PromptAnswer;
	cursor: PromptAnswer;
	isAnswered: boolean;
	constructor(x: number, y: number, width: number, height: number) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.cursor = PromptAnswer.No;
		this.answer = PromptAnswer.No;
		this.isAnswered = false;
		this.panel = new Panel(this.x, this.y, this.width, this.height);
	}

	update() {
		if (this.panel.isAnimating) return;

		if (keyWasPressed('a') || keyWasPressed('d')) {
			this.cursor = this.cursor === PromptAnswer.No ? PromptAnswer.Yes : PromptAnswer.No;
		}

		if (keyWasPressed('Enter')) {
			this.isAnswered = true;
			this.answer = this.cursor;
		}
	}

	render() {
		this.panel.render();
		ctx.font = '16px zig';
		ctx.fillStyle = `rgba(255, 255, 255, ${this.cursor === PromptAnswer.Yes ? 1 : 0.2})`;
		ctx.fillText('yes', this.x + 12, this.y + 20);
		ctx.fillStyle = `rgba(255, 255, 255, 1)`;
		ctx.fillText('/', this.x + 56, this.y + 20);
		ctx.fillStyle = `rgba(255, 255, 255, ${this.cursor === PromptAnswer.No ? 1 : 0.2})`;
		ctx.fillText('no', this.x + 76, this.y + 20);
	}
}

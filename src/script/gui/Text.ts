import { canvas, ctx } from '@/global';
import { CanvasRendering } from '@/script/interface/state/CanvasRendering';
import { TextDef } from '@/script/interface/gui/TextDef';

export class Text implements CanvasRendering {
	text: string;
	x: number;
	y: number;
	maxWidth?: number;
	color: string;
	alignText: CanvasTextAlign;
	font: string;
	constructor(def: TextDef) {
		this.text = def.text;
		this.x = def.x;
		this.y = def.y;
		this.maxWidth = def.maxWidth;
		this.color = def.color;
		this.alignText = def.alignText || 'left';
		this.font = def.font || '16px zig';
	}

	update() {}

	render() {
		ctx.font = this.font;
		ctx.textAlign = this.alignText;
		ctx.fillStyle = this.color;
		ctx.fillText(this.text, this.x, this.y, this.maxWidth);
	}
}

import { ctx } from '@/global';
import { keyWasPressed } from '@/index';
import { Panel } from '@/script/gui/Panel';
import { CanvasRendering } from '@/script/interface/state/CanvasRendering';
import { getWrap } from '@/utils';

export class Textbox implements CanvasRendering {
	panel: Panel;
	x: number;
	y: number;
	width: number;
	height: number;
	textChucks: string[];
	endOfText: boolean;
	closed: boolean;
	chunkCounter: number;
	displayingChunks: string[];
	font: string;
	constructor(x: number, y: number, width: number, height: number, text: string, font: string = '16px zig') {
		this.panel = new Panel(x, y, width, height);
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.font = font;

		ctx.font = this.font;
		this.textChucks = getWrap(ctx, text, this.width - 12);

		this.chunkCounter = 0;
		this.endOfText = false;
		this.closed = false;
		this.displayingChunks = [];

		this.next();
	}

	nextChunks() {
		const chunks = [];
		for (let i = this.chunkCounter; i <= this.chunkCounter + 2; i++) {
			if (this.textChucks[i] === undefined) {
				this.endOfText = true;
				return chunks;
			}

			chunks.push(this.textChucks[i]);

			// If we've reached the number of total chunks, we can return
			if (i === this.textChucks.length) {
				this.endOfText = true;
				return chunks;
			}
		}

		this.chunkCounter += 3;

		return chunks;
	}

	next() {
		if (this.endOfText) {
			this.displayingChunks = [];
			this.panel.switch();
			this.closed = true;
		} else {
			this.displayingChunks = this.nextChunks();
		}
	}

	get isClosed() {
		return this.closed;
	}

	set setX(x: number) {
		this.x = x;
		this.panel.x = x;
	}

	set setY(y: number) {
		this.y = y;
		this.panel.y = y;
	}

	update() {
		if (!this.isClosed) {
			// Do not proceed the text if Panel animation not finished
			if (keyWasPressed('Enter') && this.panel.textVisible) {
				this.next();
			}
		}
	}

	render() {
		this.panel.render();

		if (this.panel.textVisible) {
			ctx.font = this.font;
			ctx.fillStyle = 'white';
			for (let i = 0; i < this.displayingChunks.length; i++) {
				ctx.fillText(this.displayingChunks[i], this.x + 3, this.y + 19 + i * 16);
			}
		}
	}
}

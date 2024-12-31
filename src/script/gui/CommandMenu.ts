import { ctx } from '@/global';
import { keyWasPressed } from '@/index';
import { Panel } from '@/script/gui/Panel';
import { CanvasRendering } from '@/script/interface/state/CanvasRendering';

const _window = window as any;

interface Command {
	text: string;
	onSelect: () => void;
}

export class CommandMenu implements CanvasRendering {
	x: number;
	y: number;
	width: number;
	height: number;
	panel: Panel;
	cursor: number;
	menu: Command[];
	constructor(x: number, y: number, width: number, height: number, menu: Command[]) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.menu = menu;

		this.panel = new Panel(x, y, width, height);
		this.cursor = 0;
	}

	update() {
		if (keyWasPressed('w')) {
			this.cursor += this.cursor - 1 < 0 ? 3 : -1;
		} else if (keyWasPressed('s')) {
			this.cursor += this.cursor + 1 > 3 ? -3 : 1;
		}

		if (keyWasPressed('Enter')) {
			this.menu[this.cursor].onSelect();
		}
	}

	render() {
		this.panel.render();
		ctx.font = '14px zig';
		ctx.fillStyle = 'rgba(255, 255, 255, 1)';
		let menuY = this.y + 16;
		for (const item of this.menu) {
			ctx.fillText(item.text, this.x + 24, menuY);
			menuY += 18;
		}

		const cursorImg = _window.gImages.get('cursor');
		ctx.drawImage(cursorImg, this.x + 3, this.y + this.cursor * 18 + 6);
	}
}

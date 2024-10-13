import { canvas } from '@/global';
import { Panel } from '@/script/gui/Panel';
import { CanvasRendering } from '@/script/interface/state/CanvasRendering';
import { Level } from '@/script/world/Level';

export class Textbox implements CanvasRendering {
	panel: Panel;
	level: Level;
	constructor(level: Level, x: number, y: number, width: number, height: number) {
		this.level = level;
		this.panel = new Panel(x, y, width, height);
	}

	update() {
		this.panel.update();
	}

	render() {
		this.panel.render();
	}
}

import { ctx } from '@/global';
import { ProgressBarDef } from '@/script/interface/game/ProgressBarDef';
import { CanvasRendering } from '@/script/interface/state/CanvasRendering';

export class ProgressBar implements CanvasRendering {
	x: number;
	y: number;
	width: number;
	height: number;
	value: number;
	max: number;
	color: { r: number; g: number; b: number };
	constructor(def: ProgressBarDef) {
		this.x = def.x;
		this.y = def.y;

		this.width = def.width;
		this.height = def.height;

		this.color = def.color;

		this.value = def.value;
		this.max = def.max;
	}

	set setMax(max: number) {
		this.max = max;
	}

	set setValue(value: number) {
		this.value = value;
	}

	update() {}

	render() {
		// Draw outline around actual bar
		ctx.fillStyle = 'rgba(255, 255, 255, 1)';
		ctx.fillRect(this.x, this.y, this.width, this.height);

		// Multiplier on width based on progress
		const renderWidth = Math.min(this.max, (this.value / this.max) * this.width);

		// Draw main bar, with calculated width based on value / max
		ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 1)`;

		if (this.value > 0) {
			ctx.fillRect(this.x + 1, this.y + 1, renderWidth - 2, this.height - 2);
		}
	}
}

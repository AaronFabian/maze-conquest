import { ctx, Tween } from '@/global';
import { CanvasRendering } from '@/script/interface/state/CanvasRendering';

export class Panel implements CanvasRendering {
	visible: boolean;
	textVisible: boolean;
	x: number;
	y: number;
	width: number;
	height: number;
	constructor(x: number, y: number, width: number, height: number) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = 0;

		this.visible = true;
		this.textVisible = false;

		new Tween(this)
			.to({ height: height }, 250)
			.onComplete(() => {
				this.textVisible = true;
			})
			.start();
	}

	update() {}

	render() {
		if (this.visible) {
			ctx.fillStyle = 'rgba(255, 255, 255, 1)';
			ctx.fillRect(this.x, this.y, this.width, this.height);
			ctx.fillStyle = 'rgba(56, 56, 56, 1)';
			ctx.fillRect(this.x + 2, this.y + 2, this.width - 4, this.height - 4);
		}
	}
}

import { CanvasRendering } from '@/script/interface/state/CanvasRendering';

export class Modal implements CanvasRendering {
	x: number;
	y: number;
	width: number;
	height: number;
	overlay: boolean;
	constructor(x: number, y: number, width: number, height: number, overlay: boolean = true) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.overlay = overlay;
	}

	update() {}

	render() {}
}

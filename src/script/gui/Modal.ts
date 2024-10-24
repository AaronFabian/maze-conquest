import { CanvasRendering } from '@/script/interface/state/CanvasRendering';

export class Modal implements CanvasRendering {
	x: number;
	y: number;
	width: number;
	height: number;
	constructor(x: number, y: number, width: number, height: number) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	update() {}

	render() {}
}

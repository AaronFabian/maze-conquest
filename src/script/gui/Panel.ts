import { ctx, TILE_SIZE, Tween } from '@/global';
import { keyWasPressed } from '@/index.js';
import { CanvasRendering } from '@/script/interface/state/CanvasRendering';
import { _QuadImage } from '@/utils';
import { ITEM_OBJECT_DEFS } from '../interface/object/item_object_defs.js';

const _window = window as any;

export class Panel implements CanvasRendering {
	visible: boolean;
	textVisible: boolean;
	x: number;
	y: number;
	width: number;
	height: number;
	isAnimating: boolean;
	constructor(x: number, y: number, width: number, height: number) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = 0;

		this.visible = true;
		this.textVisible = false;
		this.isAnimating = true;
		new Tween(this)
			.to({ height: height }, 250)
			.onComplete(() => {
				this.isAnimating = false;
				this.textVisible = true;
			})
			.start();
	}

	toggle() {
		this.visible = !this.visible;
	}

	switch() {
		this.isAnimating = true;
		new Tween(this)
			.to({ height: this.visible ? 0 : this.height }, 250)
			.onComplete(() => {
				this.isAnimating = false;
				this.toggle();
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

export class Panel2 implements CanvasRendering {
	constructor(
		public xPos: number,
		public yPos: number,
		public tileWidthCount: number,
		public tileHeightCount: number
	) {}

	update() {}

	render() {
		const quads = _window.gFrames.get('dialogue') as _QuadImage[];

		// The panel itself
		for (let y = 0; y < this.tileHeightCount; y++) {
			for (let x = 0; x < this.tileWidthCount; x++) {
				if (y > 0 && x > 0 && y < this.tileHeightCount - 1 && x < this.tileWidthCount - 1) {
					quads[4].drawImage(ctx, this.xPos + x * TILE_SIZE, this.yPos + y * TILE_SIZE);
				} else if (y === 0 && x === 0) {
					quads[0].drawImage(ctx, this.xPos + x * TILE_SIZE, this.yPos + y * TILE_SIZE);
				} else if (y === 0 && x === this.tileWidthCount - 1) {
					quads[2].drawImage(ctx, this.xPos + x * TILE_SIZE, this.yPos + y * TILE_SIZE);
				} else if (y === this.tileHeightCount - 1 && x === 0) {
					quads[6].drawImage(ctx, this.xPos + x * TILE_SIZE, this.yPos + y * TILE_SIZE);
				} else if (y === this.tileHeightCount - 1 && x === this.tileWidthCount - 1) {
					quads[8].drawImage(ctx, this.xPos + x * TILE_SIZE, this.yPos + y * TILE_SIZE);
				} else if (y === this.tileHeightCount - 1 && x > 0) {
					quads[7].drawImage(ctx, this.xPos + x * TILE_SIZE, this.yPos + y * TILE_SIZE);
				} else if (y > 0 && x === 0) {
					quads[3].drawImage(ctx, this.xPos + x * TILE_SIZE, this.yPos + y * TILE_SIZE);
				} else if (y > 0 && x === this.tileWidthCount - 1) {
					quads[5].drawImage(ctx, this.xPos + x * TILE_SIZE, this.yPos + y * TILE_SIZE);
				} else if (y === 0) {
					quads[1].drawImage(ctx, this.xPos + x * TILE_SIZE, this.yPos + y * TILE_SIZE);
				}
			}
		}
	}
}

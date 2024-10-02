import { ctx } from '@/global';
import { CanvasRendering } from '@/script/interface/state/CanvasRendering';
import { MazeObjectType } from '@/script/world/Maze';
import { _QuadImage } from '@/utils';

const _window = window as any;

enum BlockType {
	NONE = 0,
	RED = 1,
}

export class Path implements CanvasRendering {
	structure: number[][] | null;
	spriteId: number | null;
	xPos: number;
	yPos: number;
	renderPosY: number;
	renderPosX: number;

	constructor(xPos: number, yPos: number, renderPosX: number, renderPosY: number) {
		this.xPos = xPos;
		this.yPos = yPos;
		this.renderPosX = renderPosX;
		this.renderPosY = renderPosY;
		this.structure = null;
		this.spriteId = null;
	}

	generate(map: MazeObjectType[][]) {
		// If this path itself is WALL (1) or EDGE WALL (7) then just generate outer wall
		if (map[this.yPos][this.xPos] === 1 || map[this.yPos][this.xPos] === 7) {
			const structure: number[][] = [];
			for (let y = 0; y <= 4; y++) {
				structure.push([]);
				for (let x = 0; x <= 4; x++) {
					structure[y].push(BlockType.RED);
				}
			}

			this.structure = structure;
			this.spriteId = 17;

			return;
		}

		// Check what ID from this path perspective
		// Check left
		const left = map[this.yPos][this.xPos - 1];

		// Check right
		const right = map[this.yPos][this.xPos + 1];

		// Check bottom
		const bottom = map[this.yPos + 1][this.xPos];

		// Check top
		const top = map[this.yPos - 1][this.xPos];

		// Generate RED invisible wall that later evaluate player movement
		const structure: number[][] = [];
		for (let y = 0; y <= 4; y++) {
			structure.push([]);
			for (let x = 0; x <= 4; x++) {
				if (x >= 1 && x <= 3 && y >= 1 && y <= 3) {
					structure[y].push(BlockType.NONE);
				} else structure[y].push(BlockType.RED);
			}
		}

		// Save later for sprite configuration
		const sprite = {
			left: false,
			right: false,
			top: false,
			bottom: false,
		};

		// Evaluate this path
		switch (left) {
			case MazeObjectType.SPACE:
				break;
			case MazeObjectType.WALL:
				break;

			case MazeObjectType.PATH:
				structure[1][0] = BlockType.NONE;
				structure[2][0] = BlockType.NONE;
				structure[3][0] = BlockType.NONE;
				sprite.left = true;
				break;

			default:
				console.warn(left);
				throw new Error('Unexpected configuration at Left block');
		}

		switch (right) {
			case MazeObjectType.SPACE:
				break;
			case MazeObjectType.WALL:
				break;

			case MazeObjectType.PATH:
				structure[1][4] = BlockType.NONE;
				structure[2][4] = BlockType.NONE;
				structure[3][4] = BlockType.NONE;
				sprite.right = true;
				break;

			default:
				console.warn(right);
				throw new Error('Unexpected configuration at Right block');
		}

		switch (top) {
			case MazeObjectType.SPACE:
				break;
			case MazeObjectType.WALL:
				break;

			case MazeObjectType.PATH:
				structure[0][1] = BlockType.NONE;
				structure[0][2] = BlockType.NONE;
				structure[0][3] = BlockType.NONE;
				sprite.top = true;
				break;

			default:
				console.warn(top);
				throw new Error('Unexpected configuration at Top block');
		}

		switch (bottom) {
			case MazeObjectType.SPACE:
				break;
			case MazeObjectType.WALL:
				break;

			case MazeObjectType.PATH:
				structure[4][1] = BlockType.NONE;
				structure[4][2] = BlockType.NONE;
				structure[4][3] = BlockType.NONE;
				sprite.bottom = true;
				break;

			default:
				console.warn(bottom);
				throw new Error('Unexpected configuration at Bottom block');
		}

		this.structure = structure;

		// Decide which sprite to render
		let spriteId = 7;
		if (!sprite.left && sprite.right && !sprite.top && sprite.bottom) spriteId = 0;
		else if (sprite.left && sprite.right && !sprite.top && sprite.bottom) spriteId = 1;
		else if (sprite.left && !sprite.right && !sprite.top && sprite.bottom) spriteId = 2;
		else if (sprite.left && sprite.right && !sprite.top && !sprite.bottom) spriteId = 3;
		else if (!sprite.left && !sprite.right && sprite.top && sprite.bottom) spriteId = 4;
		else if (!sprite.left && !sprite.right && !sprite.top && sprite.bottom) spriteId = 5;
		else if (!sprite.left && sprite.right && sprite.top && sprite.bottom) spriteId = 6;
		else if (sprite.left && sprite.right && sprite.top && sprite.bottom) spriteId = 7; // center
		else if (sprite.left && !sprite.right && sprite.top && sprite.bottom) spriteId = 8;
		else if (!sprite.left && !sprite.right && sprite.top && !sprite.bottom) spriteId = 9;
		else if (!sprite.left && sprite.right && !sprite.top && !sprite.bottom) spriteId = 10;
		else if (!sprite.left && !sprite.right && sprite.top && !sprite.bottom) spriteId = 11;
		else if (!sprite.left && sprite.right && sprite.top && !sprite.bottom) spriteId = 12;
		else if (sprite.left && sprite.right && sprite.top && !sprite.bottom) spriteId = 13;
		else if (sprite.left && !sprite.right && sprite.top && !sprite.bottom) spriteId = 14;
		else if (!sprite.left && !sprite.right && !sprite.top && sprite.bottom) spriteId = 15;
		else if (sprite.left && !sprite.right && !sprite.top && !sprite.bottom) spriteId = 16;
		else throw new Error('Unexpected SpriteId configuration');

		this.spriteId = spriteId;
	}

	update() {}

	render() {
		const sprites = _window.gFrames.get('level1') as _QuadImage[];
		if (!this.spriteId === null) throw new Error('[Path] spriteId found null');
		sprites[this.spriteId!].drawImage(ctx, this.renderPosX * 80, this.renderPosY * 80);

		ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
		for (let y = 0; y <= 4; y++) {
			for (let x = 0; x <= 4; x++) {
				const block = this.structure![y][x];
				if (block === BlockType.RED)
					// For debugging purpose
					ctx.fillRect(this.renderPosX * 80 + 16 * x, this.renderPosY * 80 + 16 * y, 16, 16);
			}
		}
	}
}

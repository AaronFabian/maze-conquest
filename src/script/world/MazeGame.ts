import { ctx } from '@/global';
import { SystemError } from '@/script/world/Error/SystemError';
import { Maze, MazeObjectType } from '@/script/world/Maze';
import { _QuadImage, random } from '@/utils';
import { Level } from './Level.js';

const _window = window as any;

export class MazeGame extends Maze {
	slicedMap!: Array<Array<Array<Array<MazeObjectType>>>>;
	level: Level;

	constructor(width: number, height: number, level: Level) {
		super(width, height);
		this.level = level;
	}

	initPlayerPosition(x?: number, y?: number) {
		// If true make it random
		if (!x && !y) {
			const maxAttempts = 100;
			let attempts = 0;

			while (attempts < maxAttempts) {
				const initialX = random(1, this.height - 1);
				const initialY = random(1, this.width - 1);

				if (this.data[initialY][initialX] !== MazeObjectType.WALL) {
					[this.level.world.player.x, this.level.world.player.y] = [initialX, initialY];
					console.log(`[Maze] player set at x = ${this.level.world.player.x}, y = ${this.level.world.player.y}`);

					return; // Exit loop if a valid position is found
				}

				attempts += 1;
			}

			throw new SystemError('Failed to find a valid for player position, please restart the game');
		} else {
			[this.level.world.player.x, this.level.world.player.y] = [x!, y!];
			console.log(`[Maze] set player x = ${x}, y = ${y}`);
		}
	}

	mapSlicer() {
		// const dungeonTileDimension = 80;
		const renderWidth = 15;
		const renderHeight = 8;
		const slicedWidth = Math.floor(this.width / renderWidth);
		const slicedHeight = Math.floor(this.height / renderHeight);
		console.log(slicedWidth);

		const slicedMap: Array<Array<Array<Array<MazeObjectType>>>> = [];
		for (let y = 0; y <= slicedHeight; y++) {
			slicedMap.push([]);
			for (let x = 0; x <= slicedWidth; x++) {
				const sliceY = this.data.slice(y * renderHeight, y * renderHeight + 8);
				const sliceX = sliceY.map(row => row.slice(x * renderWidth, x * renderWidth + renderWidth));

				slicedMap[y].push(sliceX);
			}
		}

		console.log(slicedMap);
		this.slicedMap = slicedMap;
	}

	override draw() {
		const EDGE_OFFSET = 0;
		const sprites = _window.gFrames.get('level1') as _QuadImage[];
		const xCoord = 0;
		const yCoord = 0;
		const map = this.slicedMap[yCoord][xCoord];

		// const mapHeight = map.length;
		// for (let y = 0; y < mapHeight; y++) {
		// 	const mapWidth = map[y].length;
		// 	for (let x = 0; x < mapWidth; x++) {
		// 		const left = map[y][x - 1] === MazeObjectType.PATH;
		// 		const right = map[y][x + 1] === MazeObjectType.PATH;
		// 		const top = map[y - 1]?.[x] === MazeObjectType.PATH;
		// 		const bottom = map[y + 1]?.[x] === MazeObjectType.PATH;
		// 		const self = map[y][x] === MazeObjectType.WALL;

		// 		// If the the player at the edge of the map but not SPACE
		// 		const leftPath = map[y][x - 1] === undefined;
		// 		const rightPath = map[y][x - 1] === undefined;
		// 		const topPath = map[y - 1]?.[x] === undefined;
		// 		const bottomPath = map[y + 1]?.[x] === undefined;
		// 		const selfSpace = map[y][x] === MazeObjectType.SPACE;

		// 		// Draw the appropriate sprite based on the surrounding tiles
		// 		const positionX = x * 80;
		// 		const positionY = y * 80;

		// 		console.log(map);
		// 		// prettier-ignore
		// 		this.drawTile(self,
		// 			// selfSpace,
		// 			left, right, top, bottom,
		// 			leftPath, rightPath, topPath, bottomPath,
		// 			positionX, positionY, sprites,
		// 		);
		// 	}
		// }
	}

	// prettier-ignore
	private drawTile(
		self: boolean,
		// selfSpace: boolean,
		left: boolean, right: boolean, top: boolean, bottom: boolean,
		leftPath: boolean, rightPath: boolean, topPath: boolean, bottomPath: boolean,
		x: number, y: number, sprites: _QuadImage[]
	) {
		// console.log(
		// 	self,
		// 	// selfSpace,
		// 	left, right, top, bottom,
		// 	// leftPath, rightPath, topPath, bottomPath,
		// 	x, y, sprites
		// );

		// if (selfSpace) {
		// 	return;
		// } else if (leftPath && right && top && bottom) {
		// 	sprites[7].drawImage(ctx, x, y);
		// } else if (leftPath && !right && top && bottom) {
		// 	sprites[8].drawImage(ctx, x, y);
		// } else if (leftPath && right && !top && bottom) {
		// 	sprites[1].drawImage(ctx, x, y);
		// } else if (leftPath && right && top && !bottom) {
		// 	sprites[13].drawImage(ctx, x, y);
		// } else if (leftPath && right && !top && !bottom) {
		// 	sprites[3].drawImage(ctx, x, y);
		// } else if (leftPath && !right && top && !bottom) {
		// 	sprites[14].drawImage(ctx, x, y);
		// } else
		// console.log(self, left, right, top, bottom);
		// if (self) {
		// 	sprites[17].drawImage(ctx, x, y);
		// } else if (left && right && top && bottom) {
		// 	sprites[7].drawImage(ctx, x, y);
		// } else if (!left && right && top && bottom) {
		// 	sprites[6].drawImage(ctx, x, y);
		// } else if (left && !right && top && bottom) {
		// 	sprites[8].drawImage(ctx, x, y);
		// } else if (left && right && !top && bottom) {
		// 	sprites[1].drawImage(ctx, x, y);
		// } else if (left && right && top && !bottom) {
		// 	sprites[13].drawImage(ctx, x, y);
		// } else if (!left && !right && top && bottom) {
		// 	sprites[4].drawImage(ctx, x, y);
		// } else if (left && right && !top && !bottom) {
		// 	sprites[3].drawImage(ctx, x, y);
		// } else if (!left && right && !top && bottom) {
		// 	sprites[0].drawImage(ctx, x, y);
		// } else if (left && !right && top && !bottom) {
		// 	sprites[14].drawImage(ctx, x, y);
		// } else if (!left && right && top && !bottom) {
		// 	sprites[12].drawImage(ctx, x, y);
		// } else if (left && !right && !top && bottom) {
		// 	sprites[2].drawImage(ctx, x, y);
		// } else if (!left && !right && !top && bottom) {
		// 	sprites[15].drawImage(ctx, x, y);
		// } else if (left && !right && !top && !bottom) {
		// 	sprites[16].drawImage(ctx, x, y);
		// } else if (!left && right && !top && !bottom) {
		// 	sprites[10].drawImage(ctx, x, y);
		// } else if (!left && !right && top && !bottom) {
		// 	sprites[9].drawImage(ctx, x, y);
		// } else {
		// 	throw new Error('Unexpected tile configuration');
		// }
	}
}

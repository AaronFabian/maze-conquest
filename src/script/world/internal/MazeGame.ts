import { SystemError } from '@/script/system/error/SystemError';
import { Level } from '@/script/world/Level';
import { Maze, MazeObjectType } from '@/script/world/internal/Maze';
import { random } from '@/utils';

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

				const notWALL = this.data[initialY][initialX] !== MazeObjectType.WALL;
				const notSPACE = this.data[initialY][initialX] !== MazeObjectType.SPACE;
				if (notWALL && notSPACE) {
					[this.level.world.player.xCoord, this.level.world.player.yCoord] = [initialX, initialY];
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

		const slicedMap: Array<Array<Array<Array<MazeObjectType>>>> = [];
		for (let y = 0; y <= slicedHeight; y++) {
			slicedMap.push([]);
			for (let x = 0; x <= slicedWidth; x++) {
				const sliceY = this.data.slice(y * renderHeight, y * renderHeight + 8);
				const sliceX = sliceY.map(row => row.slice(x * renderWidth, x * renderWidth + renderWidth));

				slicedMap[y].push(sliceX);
			}
		}

		this.slicedMap = slicedMap;
	}
}

import { ctx } from '@/global';
import { SystemError } from '@/script/system/error/SystemError';
import { _QuadImage, random } from '@/utils';

const _window = window as any;

export enum MazeObjectType {
	PATH = 0,
	WALL = 1,
	PLAYER = 2,
	FINISHED_POINT = 3,
	TRACE_POINT = 4,
	ITEM = 5,
	ENEMY = 6,
	SPACE = 7,
}

export enum Direction {
	UP = 0,
	DOWN = 1,
	LEFT = 2,
	RIGHT = 3,
}

export class Maze {
	protected width: number;
	protected height: number;
	protected isCreated: boolean;
	protected startPath: Array<Array<number>>;
	public data: Array<Array<MazeObjectType>>;

	constructor(width: number, height: number) {
		if (width < 5 || width % 2 === 0 || height < 5 || height % 2 === 0)
			throw new SystemError('Error must input odd number');

		this.data = [];
		this.startPath = [];
		this.width = width;
		this.height = height;
		this.isCreated = false;
	}

	create() {
		/*
			[
				[WALL, WALL, WALL, WALL],
				[WALL, WALL, WALL, WALL],
				[WALL, WALL, WALL, WALL]
			]
		*/
		this.data = [];
		for (let y = 0; y < this.width; y++) {
			this.data.push([]);
			for (let x = 0; x < this.height; x++) {
				if (x === 0 || y === 0 || x === this.width - 1 || y === this.height - 1) {
					this.data[y].push(MazeObjectType.SPACE);
				} else {
					this.data[y].push(MazeObjectType.WALL);
				}
			}
		}

		this.startPath = [];
	}

	dig(x: number, y: number) {
		const stack = [[x, y]];
		this.data[y][x] = MazeObjectType.PATH;

		while (stack.length > 0) {
			let [currentX, currentY] = stack.pop()!;
			let digFlag = false;

			// Give options which direction should go
			const directions = [];

			if (currentY > 2 && this.data[currentY - 2][currentX] === MazeObjectType.WALL) {
				directions.push(Direction.UP);
			}
			if (currentY < this.height - 2 && this.data[currentY + 2][currentX] === MazeObjectType.WALL) {
				directions.push(Direction.DOWN);
			}
			if (currentX > 2 && this.data[currentY][currentX - 2] === MazeObjectType.WALL) {
				directions.push(Direction.LEFT);
			}
			if (currentX < this.width - 2 && this.data[currentY][currentX + 2] === MazeObjectType.WALL) {
				directions.push(Direction.RIGHT);
			}

			// Choose which direction should go
			if (directions.length > 0) {
				stack.push([currentX, currentY]);

				const direction = directions[random(0, directions.length - 1)];

				if (direction === Direction.UP) {
					this.data[currentY - 1][currentX] = MazeObjectType.PATH;
					this.data[currentY - 2][currentX] = MazeObjectType.PATH;
					currentY -= 2;
				} else if (direction === Direction.DOWN) {
					this.data[currentY + 1][currentX] = MazeObjectType.PATH;
					this.data[currentY + 2][currentX] = MazeObjectType.PATH;
					currentY += 2;
				} else if (direction === Direction.LEFT) {
					this.data[currentY][currentX - 1] = MazeObjectType.PATH;
					this.data[currentY][currentX - 2] = MazeObjectType.PATH;
					currentX -= 2;
				} else if (direction === Direction.RIGHT) {
					this.data[currentY][currentX + 1] = MazeObjectType.PATH;
					this.data[currentY][currentX + 2] = MazeObjectType.PATH;
					currentX += 2;
				}

				stack.push([currentX, currentY]);
			}

			// Find the branch
			if (stack.length === 0 && this.startPath.length > 0) {
				const index = random(0, this.startPath.length - 1);
				const [branchX, branchY] = this.startPath.splice(index, 1)[0];
				stack.push([branchX, branchY]);
			}
		}

		this.isCreated = true;
	}

	draw() {
		const EDGE_OFFSET = 0;
		const sprites = _window.gFrames.get('level1') as _QuadImage[];
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				if (x === 0 || y === 0 || x === this.width - 1 || y === this.height - 1) continue;
				const left = this.data[y][x - 1] === MazeObjectType.PATH;
				const right = this.data[y][x + 1] === MazeObjectType.PATH;
				const top = this.data[y - 1][x] === MazeObjectType.PATH;
				const bottom = this.data[y + 1][x] === MazeObjectType.PATH;
				const self = this.data[y][x] === MazeObjectType.WALL;

				if (self) {
					sprites[17].drawImage(ctx, EDGE_OFFSET + x * 80, EDGE_OFFSET + y * 80);
				} else if (left && right && top && bottom) {
					// All sides are paths
					sprites[7].drawImage(ctx, EDGE_OFFSET + x * 80, EDGE_OFFSET + y * 80);
				} else if (!left && right && top && bottom) {
					// Left is wall, others are paths
					sprites[6].drawImage(ctx, EDGE_OFFSET + x * 80, EDGE_OFFSET + y * 80);
				} else if (left && !right && top && bottom) {
					// Right is wall, others are paths
					sprites[8].drawImage(ctx, EDGE_OFFSET + x * 80, EDGE_OFFSET + y * 80);
				} else if (left && right && !top && bottom) {
					// Top is wall, others are paths
					sprites[1].drawImage(ctx, EDGE_OFFSET + x * 80, EDGE_OFFSET + y * 80);
				} else if (left && right && top && !bottom) {
					// Bottom is wall, others are paths
					sprites[13].drawImage(ctx, EDGE_OFFSET + x * 80, EDGE_OFFSET + y * 80);
				} else if (!left && !right && top && bottom) {
					// Left and right are walls, others are paths
					sprites[4].drawImage(ctx, EDGE_OFFSET + x * 80, EDGE_OFFSET + y * 80);
				} else if (left && right && !top && !bottom) {
					// Top and bottom are walls, others are paths
					sprites[3].drawImage(ctx, EDGE_OFFSET + x * 80, EDGE_OFFSET + y * 80);
				} else if (!left && right && !top && bottom) {
					// Top and left are walls, right and bottom are paths
					sprites[0].drawImage(ctx, EDGE_OFFSET + x * 80, EDGE_OFFSET + y * 80);
				} else if (left && !right && top && !bottom) {
					// Right and bottom are walls, left and top are paths
					sprites[14].drawImage(ctx, EDGE_OFFSET + x * 80, EDGE_OFFSET + y * 80);
				} else if (!left && right && top && !bottom) {
					// Bottom and left are walls, right and top are paths
					sprites[12].drawImage(ctx, EDGE_OFFSET + x * 80, EDGE_OFFSET + y * 80);
				} else if (left && !right && !top && bottom) {
					// Right and top are walls, left and bottom are paths
					sprites[2].drawImage(ctx, EDGE_OFFSET + x * 80, EDGE_OFFSET + y * 80);
				} else if (!left && !right && !top && bottom) {
					// Left, right, and top are walls, bottom is path
					sprites[15].drawImage(ctx, EDGE_OFFSET + x * 80, EDGE_OFFSET + y * 80);
				} else if (left && !right && !top && !bottom) {
					// Right, top, and bottom are walls, left is path
					sprites[16].drawImage(ctx, EDGE_OFFSET + x * 80, EDGE_OFFSET + y * 80);
				} else if (!left && right && !top && !bottom) {
					// Left, top, and bottom are walls, right is path
					sprites[10].drawImage(ctx, EDGE_OFFSET + x * 80, EDGE_OFFSET + y * 80);
				} else if (!left && !right && top && !bottom) {
					// Left, right, and bottom are walls, top is path
					sprites[9].drawImage(ctx, EDGE_OFFSET + x * 80, EDGE_OFFSET + y * 80);
				} else throw new Error('Unexpected behavior');
			}
		}
	}
}

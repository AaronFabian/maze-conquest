import { CanvasRendering } from '@/script/interface/state/CanvasRendering';
import { Path } from '@/script/object/world/Path';
import { GameState } from '@/script/state/game/GameState';
import { MazeGame } from '@/script/world/MazeGame';
import { SystemError } from './Error/SystemError';
import { Event } from '@/utils';
import { Player } from '@/script/object/entity/Player';
import { ctx, Tween } from '@/global';

export class Level implements CanvasRendering {
	maze: MazeGame;
	world: GameState;
	paths: Path[][];
	currentMapPartX: number | null;
	currentMapPartY: number | null;
	nextPaths: Path[][] | null;
	shifting: boolean;
	nextMapPartX: number | null;
	nextMapPartY: number | null;
	adjacentOffsetX: number;
	adjacentOffsetY: number;
	constructor(state: GameState) {
		this.world = state;

		// 01
		this.maze = new MazeGame(21, 21, this);

		// 02 Fill the maze dimension and fill with ex: WALL
		this.maze.create();

		// 03 Start digging for path, 1,1 mean start from left right at position 1,1 2D Array
		this.maze.dig(1, 1);

		// 04 Later will be assigned / late init
		this.paths = [];
		this.shifting = false;
		this.currentMapPartX = null;
		this.currentMapPartY = null;
		this.adjacentOffsetX = 0;
		this.adjacentOffsetY = 0;

		// 05
		this.nextPaths = null;
		this.nextMapPartX = null;
		this.nextMapPartY = null;

		Event.on('shift-left', () => {
			this.beginShifting('left');
		});
		Event.on('shift-right', () => {
			this.beginShifting('right');
		});
		Event.on('shift-top', () => {
			this.beginShifting('top');
		});
		Event.on('shift-bottom', () => {
			this.beginShifting('bottom');
		});
	}

	setup() {
		// 04 Tell the maze level to place the player
		this.maze.initPlayerPosition();

		// 05
		// Slice the maze so the game efficiently performance,
		// the player required for make player spawn randomly
		this.maze.mapSlicer();

		// 06 Take sliced map and then render that map only
		// const renderWidth = 15;
		// const renderHeight = 8;
		const [playerXCoord, playerYCoord] = [this.world.player.xCoord, this.world.player.yCoord];
		const [mapPartX, mapPartY] = [Math.floor(playerXCoord / 15), Math.floor(playerYCoord / 8)];
		const currentMap = this.maze.slicedMap[mapPartY][mapPartX];

		this.currentMapPartX = mapPartX;
		this.currentMapPartY = mapPartY;
		console.log('[System] Player position ', playerXCoord, playerYCoord);
		console.log(`[System] Player using mapPartX ${mapPartX}, mapPartY ${mapPartY}`);

		// 07 create Path instances from sliced Map
		const paths: Array<Array<Path>> = [];
		for (let y = 0; y < currentMap.length; y++) {
			paths.push([]);
			for (let x = 0; x < currentMap[y].length; x++) {
				// xPos and yPos relative to canvas from top left
				// you cannot use x and y here
				// Ok I know that if I zoom out 21 x 21
				// console.log(this.maze.data);

				// When I make the piece of this map by 15 x 8
				// console.log(this.maze.data.length / 15, this.maze.data[y].length / 8);

				// In order to find the position of this path only by zooming the data is return it calc by 15 x 8;
				// For example if player at position 3 x 20 at real map

				// When it zoom it then the chosen piece would be 3/15  x 20/8
				// Equal 0.2 x 2.5
				// console.log(3 / 15, 20 / 8);

				// Get the map coordination from The zoom in map / pieced map
				// console.log(mapPartX, mapPartY);

				// The problem is I want to use mapPartX and mapPartY
				// Example result is 1 x 1 sliced map used then in order to get the real map of that position is
				// 1 . 15 + 0 and 1 . 8 + 0
				// Equal in real map is 15 x 8
				// console.log(mapPartX * 15 + 0, mapPartY * 8 + 0);

				const renderPosX = x;
				const renderPosY = y;
				const xPos = mapPartX * 15 + x;
				const yPos = mapPartY * 8 + y;
				const path = new Path(this, xPos, yPos, renderPosX, renderPosY);
				path.generate();
				paths[y].push(path);
			}
		}

		// console.log(paths);
		this.paths = paths;

		// Set the player position in this current map with player and the middle
		this.world.player.x = (playerXCoord - 15 * mapPartX) * 80 + 16 * 2;
		this.world.player.y = (playerYCoord - 8 * mapPartY) * 80 + 16 * 2;
	}

	private beginShifting(direction: string) {
		if (this.nextMapPartX === null || this.nextMapPartY === null)
			throw new SystemError('[Level] Unexpected configuration for next map');
		// console.log(this.currentMapPartX, this.currentMapPartY);

		// 01 Tell Level that we are shifting the camera
		this.shifting = true;

		// 02 Generate next Path[][]
		const nextMap = this.maze.slicedMap[this.nextMapPartY][this.nextMapPartX];
		const paths: Array<Array<Path>> = [];
		for (let y = 0; y < nextMap.length; y++) {
			paths.push([]);
			for (let x = 0; x < nextMap[y].length; x++) {
				const renderPosX = x;
				const renderPosY = y;
				const xPos = this.nextMapPartX * 15 + x;
				const yPos = this.nextMapPartY * 8 + y;
				const path = new Path(this, xPos, yPos, renderPosX, renderPosY);
				path.generate();
				paths[y].push(path);
			}
		}

		this.nextPaths = paths;

		// This will render the next paths at the other side
		const currentXLength = this.paths[0].length;
		const currentYLength = this.paths.length;
		let adjacentOffsetX = 0;
		let adjacentOffsetY = 0;
		let playerAdjacentX = 0;
		let playerAdjacentY = 0;
		switch (direction) {
			case 'left':
				adjacentOffsetX = -(80 * currentXLength);
				adjacentOffsetY = 0;
				playerAdjacentX = this.world.player.x - adjacentOffsetX - 60;
				playerAdjacentY = this.world.player.y - adjacentOffsetY;
				break;
			case 'right':
				adjacentOffsetX = 80 * currentXLength;
				adjacentOffsetY = 0;
				playerAdjacentX = this.world.player.x - adjacentOffsetX + 60;
				playerAdjacentY = this.world.player.y - adjacentOffsetY;
				break;
			case 'top':
				adjacentOffsetX = 0;
				adjacentOffsetY = -(80 * currentYLength);
				playerAdjacentX = this.world.player.x - adjacentOffsetX;
				playerAdjacentY = this.world.player.y - adjacentOffsetY - 60;
				break;
			case 'bottom':
				adjacentOffsetX = 0;
				adjacentOffsetY = 80 * currentYLength;
				playerAdjacentX = this.world.player.x - adjacentOffsetX;
				playerAdjacentY = this.world.player.y - adjacentOffsetY + 60;
				break;
			default:
				throw new SystemError('Unexpected behaviour when beginShifting() at determining the shifting direction');
		}

		// Begin shifting animation for new Path[] and the old path[];
		this.adjacentOffsetX = adjacentOffsetX;
		this.adjacentOffsetY = adjacentOffsetY;
		new Tween(this)
			.to({ adjacentOffsetX: 0, adjacentOffsetY: 0 }, 2500)
			.onComplete(() => {
				console.log('shifting ok');
			})
			.start();

		new Tween(this.world.player)
			.to({ x: playerAdjacentX, y: playerAdjacentY }, 2500)
			.onComplete(() => {})
			.start();
	}

	update() {
		// for (const yRow of this.paths) {
		// 	for (const path of yRow) {
		// 		path.update(this.world.player);
		// 	}
		// }

		// Only updating the Player Animation
		if (this.shifting) {
			this.world.player.currentAnimation!.update();
		} else {
			this.world.player.update();
		}
	}

	render() {
		// const test = new Path(2, 1);
		// test.generate(this.maze.data);
		// test.render();
		if (this.paths.length === 0) throw new SystemError('Unexpected paths properties');
		for (let y = 0; y < this.paths.length; y++) {
			for (let x = 0; x < this.paths[y].length; x++) {
				const path = this.paths[y][x];
				path.render();
				for (const mapBtn of path.mapButtons) {
					mapBtn.render();
				}
			}
		}

		if (this.nextPaths !== null) {
			ctx.save();
			ctx.translate(this.adjacentOffsetX, this.adjacentOffsetY);
			for (let y = 0; y < this.nextPaths.length; y++) {
				for (let x = 0; x < this.nextPaths[y].length; x++) {
					const path = this.nextPaths[y][x];
					path.render();
					for (const mapBtn of path.mapButtons) {
						console.log('mapbtn render');
						mapBtn.render();
					}
				}
			}
			ctx.restore();
		}

		this.world.player.render();
		console.log(this.world.player.x, this.world.player.y);
	}
}

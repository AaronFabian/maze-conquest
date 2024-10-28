import { CanvasRendering } from '@/script/interface/state/CanvasRendering';
import { GameState } from '@/script/state/game/GameState';
import { MazeGame } from '@/script/world/MazeGame';
import { SystemError } from './Error/SystemError';
import { Event, random } from '@/utils';
import { canvas, ctx, Tween } from '@/global';
import { MazeObjectType } from '@/script/world/Maze';
import { MapPart } from '@/script/world/MapPart';
import { World } from '@/script/world/World';

export class Level extends World {
	world: GameState;
	maze: MazeGame;
	currentMapPart: MapPart | null;
	nextMapPart: MapPart | null;
	currentMapPartX: number | null;
	currentMapPartY: number | null;

	shifting: boolean;
	nextMapOpacity: number;
	nextMapPartX: number | null;
	nextMapPartY: number | null;
	adjacentOffsetX: number;
	adjacentOffsetY: number;
	currentMapOffsetY: number;
	currentMapOffsetX: number;
	currentMapOpacity: number;
	cameraOffsetX: number;
	cameraOffsetY: number;

	constructor(world: GameState) {
		super();

		this.world = world;

		// 01
		this.cameraOffsetX = 0;
		this.cameraOffsetY = 0;
		this.maze = new MazeGame(21, 21, this);

		// 02 Fill the maze dimension and fill with ex: WALL
		this.maze.create();

		// 03 Start digging for path, 1,1 mean start from left right at position 1,1 2D Array
		this.maze.dig(1, 1);

		// 04 Later will be assigned / late init
		this.shifting = false;
		this.currentMapOffsetX = 0;
		this.currentMapOffsetY = 0;
		this.adjacentOffsetX = 0;
		this.adjacentOffsetY = 0;

		this.currentMapPart = null;
		this.currentMapPartX = null;
		this.currentMapPartY = null;

		this.currentMapOpacity = 1;
		this.nextMapOpacity = 0;

		// 05
		this.nextMapPart = null;
		this.nextMapPartX = null;
		this.nextMapPartY = null;

		// 06 Later will be trigger if Event.dispatch called, ex: Event.dispatch('shift-left') will trigger Event.on('shift-left')
		Event.on('shift-left', () => this.beginShifting('left'));
		Event.on('shift-right', () => this.beginShifting('right'));
		Event.on('shift-top', () => this.beginShifting('top'));
		Event.on('shift-bottom', () => this.beginShifting('bottom'));
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
		this.currentMapPart = new MapPart(currentMap, this.currentMapPartX, this.currentMapPartY, this);

		// Tell this Level to generate Enemy
		this.generateEnemies(this.currentMapPart);

		// Set the player position in this current map with player and the middle
		this.world.player.x = (playerXCoord - 15 * mapPartX) * 80 + 16 * 2;
		this.world.player.y = (playerYCoord - 8 * mapPartY) * 80 + 16 * 2;

		// Setup camera offset so the map will be on the center
		this.cameraOffsetX = canvas.width / 2 - (this.currentMapPart.paths[0].length * 80) / 2;
		this.cameraOffsetY = canvas.height / 2 - (this.currentMapPart.paths.length * 80) / 2;
	}

	private generateEnemies(mapPart: MapPart) {
		const paths = mapPart.paths;

		// At least one 1 guaranteed
		const totalEnemies = random(1, Math.floor(paths[0].length + paths.length));
		// const totalEnemies = random(1, Math.floor((paths[0].length + paths.length) / 2));

		// A list that algorithm should be avoid
		const objectShouldAvoid = [MazeObjectType.WALL, MazeObjectType.SPACE, MazeObjectType.ITEM];

		for (let i = 1; i <= totalEnemies; i++) {
			while (true) {
				const [x, y] = [random(1, paths[0].length - 1), random(1, paths.length - 1)];
				if (!objectShouldAvoid.find(o => o === paths[y][x].mazeObjectType)) {
					paths[y][x].mazeObjectType = MazeObjectType.ENEMY;
					// ! This not final, When generating enemy they can have the same spot
					// console.log(`[System] enemy set at ${x} ${y}`);
					break;
				}
			}
		}
	}

	private beginShifting(direction: string) {
		if (this.nextMapPartX === null || this.nextMapPartY === null)
			throw new SystemError('Unexpected configuration for next map');

		// 01 Tell Level that we are shifting the camera
		this.shifting = true;

		// 02 Generate next MapPart
		const nextMap = this.maze.slicedMap[this.nextMapPartY][this.nextMapPartX];
		this.nextMapPart = new MapPart(nextMap, this.nextMapPartX, this.nextMapPartY, this);

		// Tell this Level to generate Enemy
		this.generateEnemies(this.nextMapPart);

		// this.nextPaths = this.generateEnemies(paths);

		// 03 This will render the next paths at the other side
		const xLength = this.nextMapPart!.paths[0].length;
		const yLength = this.nextMapPart!.paths.length;
		const currentXLength = this.currentMapPart!.paths[0].length;
		const currentYLength = this.currentMapPart!.paths.length;

		let adjacentOffsetX = 0;
		let adjacentOffsetY = 0;
		let playerAdjacentX = 0;
		let playerAdjacentY = 0;
		switch (direction) {
			case 'left':
				adjacentOffsetX = -(80 * xLength);
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
				adjacentOffsetY = -(80 * yLength);
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
		const cameraOffsetX = canvas.width / 2 - (this.nextMapPart!.paths[0].length * 80) / 2;
		const cameraOffsetY = canvas.height / 2 - (this.nextMapPart!.paths.length * 80) / 2;

		// Set Player to idle while next map fade in
		this.world.player.changeState('idle');

		// 04 - [1]
		new Tween(this)
			.to({ nextMapOpacity: 1 }, 500)
			.onComplete(() => {
				// 04 - [2]
				// After new map generate, set again Player into walk while Transition, so the Player looks like walking through next map
				this.world.player.changeState('walk');

				new Tween(this)
					.to({ adjacentOffsetX: 0, adjacentOffsetY: 0 }, 2500)
					.onComplete(() => {})
					.start();

				new Tween(this)
					.to({ currentMapOffsetX: -adjacentOffsetX, currentMapOffsetY: -adjacentOffsetY }, 2500)
					.onComplete(() => {})
					.start();

				new Tween(this)
					.to({ cameraOffsetX: cameraOffsetX, cameraOffsetY: cameraOffsetY }, 2500)
					.onComplete(() => {})
					.start();

				new Tween(this.world.player)
					.to({ x: playerAdjacentX, y: playerAdjacentY }, 2500)
					.onComplete(() => {
						// 04 - [3]
						// Make Player stop walking while fading out the old map
						this.world.player.changeState('idle');

						new Tween(this)
							.to({ currentMapOpacity: 0 }, 500)
							.onComplete(() => this.finishShifting())
							.start();
					})
					.start();
			})
			.start();
	}

	private finishShifting() {
		// Assign the next MapPath to become current MapPart
		if (this.nextMapPart === null) throw new SystemError('Null was given from finishShifting()');
		this.currentMapPart = this.nextMapPart;
		this.currentMapPartX = this.nextMapPartX;
		this.currentMapPartY = this.nextMapPartY;
		this.nextMapPart = null;

		// Reset the offset and opacity configuration
		this.currentMapOffsetX = 0;
		this.currentMapOffsetY = 0;
		this.adjacentOffsetX = 0;
		this.adjacentOffsetY = 0;
		this.nextMapOpacity = 0;
		this.currentMapOpacity = 1;

		// After everything setup reset, make Player moveable again
		this.shifting = false;

		console.log(`[System] Player using mapPartX ${this.currentMapPartX}, mapPartY ${this.currentMapPartY}`);
	}

	update() {
		// Only updating the Player Animation
		if (this.shifting) {
			this.world.player.currentAnimation!.update();
		} else {
			this.world.player.update();
			this.currentMapPart!.update();
		}
	}

	render() {
		// Camera offset, always save the current canvas configuration so later we will fine
		ctx.save();
		ctx.translate(this.cameraOffsetX, this.cameraOffsetY);

		// Current map
		ctx.save();
		ctx.globalAlpha = this.currentMapOpacity;
		ctx.translate(this.currentMapOffsetX, this.currentMapOffsetY);
		this.currentMapPart!.render();
		ctx.globalAlpha = 1;
		ctx.restore();

		// Next map
		if (this.nextMapPart !== null) {
			ctx.save();
			ctx.globalAlpha = this.nextMapOpacity;
			ctx.translate(this.adjacentOffsetX, this.adjacentOffsetY);
			this.nextMapPart.render();
			ctx.globalAlpha = 1;
			ctx.restore();
		}

		this.world.player.render();

		// Make sure we don't mess the canvas
		ctx.restore();

		// // ! Game Log
		// ctx.font = '8px zig';
		// ctx.fillStyle = `white`;
		// ctx.fillText(`[Log] map part x:${this.currentMapPartX} y:${this.currentMapPartY}`, 16, canvas.height - 16);

		// const player = this.world.player;
		// ctx.font = '8px zig';
		// ctx.fillStyle = `white`;
		// ctx.fillText(`[Log] player coordinate x:${player.xCoord} y:${player.yCoord}`, 16, canvas.height - 16);
	}
}

/*
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
			path.generate(this.currentMapPartX, this.currentMapPartY);
			paths[y].push(path);
		}
	}
*/

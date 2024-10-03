import { CanvasRendering } from '@/script/interface/state/CanvasRendering';
import { Path } from '@/script/object/world/Path';
import { GameState } from '@/script/state/game/GameState';
import { MazeGame } from '@/script/world/MazeGame';
import { SystemError } from './Error/SystemError';

export class Level implements CanvasRendering {
	maze: MazeGame;
	world: GameState;
	paths: Path[][];
	currentMapPartX: number | null;
	currentMapPartY: number | null;
	constructor(state: GameState) {
		this.world = state;

		// 01
		this.maze = new MazeGame(21, 21, this);

		// 02 fill the maze dimension and fill with WALL
		this.maze.create();

		// 03 start digging for path, 1,1 mean start from left right at position 1,1 2D Array
		this.maze.dig(1, 1);

		this.currentMapPartX = null;
		this.currentMapPartY = null;
		this.paths = [];
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
		const [playerXCoord, playerYCoord] = [this.world.player.x, this.world.player.y];
		const [mapPartX, mapPartY] = [Math.floor(playerXCoord / 15), Math.floor(playerYCoord / 8)];
		const currentMap = this.maze.slicedMap[mapPartY][mapPartX];
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
				const path = new Path(xPos, yPos, renderPosX, renderPosY);
				path.generate(this.maze.data);
				paths[y].push(path);
			}
		}

		// console.log(paths);
		this.currentMapPartX = mapPartX;
		this.currentMapPartY = mapPartY;
		this.paths = paths;

		// Set the player position in this current map with player and the middle
		this.world.player.x = (playerXCoord - 15 * mapPartX) * 80 + 16 * 2;
		this.world.player.y = (playerYCoord - 8 * mapPartY) * 80 + 16 * 2;
	}

	update() {}

	render() {
		// const test = new Path(2, 1);
		// test.generate(this.maze.data);
		// test.render();
		if (this.paths.length === 0) throw new SystemError('Unexpected paths properties');
		for (let y = 0; y < this.paths.length; y++) {
			for (let x = 0; x < this.paths[y].length; x++) {
				const path = this.paths[y][x];
				path.render();
			}
		}
	}
}

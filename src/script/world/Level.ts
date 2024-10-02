import { CanvasRendering } from '@/script/interface/state/CanvasRendering';
import { Path } from '@/script/object/world/Path';
import { GameState } from '@/script/state/game/GameState';
import { MazeGame } from '@/script/world/MazeGame';

export class Level implements CanvasRendering {
	maze: MazeGame;
	world: GameState;
	constructor(state: GameState) {
		this.world = state;

		// 01
		this.maze = new MazeGame(21, 21, this);

		// 02 fill the maze dimension and fill with WALL
		this.maze.create();

		// 03 start digging for path, 1,1 mean start from left right at position 1,1 2D Array
		this.maze.dig(1, 1);
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

		console.log(`[SYSTEM] using mapPartX ${mapPartX}, mapPartY ${mapPartY}`);
		// 07 create Path instances from sliced Map
		const paths: Array<Array<Path>> = [];
		for (let y = mapPartY * 8; y < mapPartY * 8 + currentMap.length; y++) {
			paths.push([]);
			let counter = 0;
			for (let x = mapPartX * 15; x < mapPartX * 15 + currentMap[counter].length; x++) {
				const path = new Path(x, y);
				path.generate(this.maze.data);
				paths[counter].push(path);
				counter++;
			}
		}

		// console.log(paths);
	}

	update() {}

	render() {
		// const test = new Path(2, 1);
		// test.generate(this.maze.data);
		// test.render();
	}
}

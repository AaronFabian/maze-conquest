import { CanvasRendering } from '@/script/interface/state/CanvasRendering';
import { MazeObjectType } from '@/script/world/Maze';
import { Path } from '@/script/object/world/Path';
import { Level } from '@/script/world/Level';
import { SystemError } from '@/script/world/Error/SystemError';

export class Room implements CanvasRendering {
	currentMap: MazeObjectType[][];
	mapPartX: number;
	mapPartY: number;
	level: Level;
	paths: Path[][];
	opacity: number;
	constructor(currentMap: MazeObjectType[][], mapPartX: number, mapPartY: number, level: Level) {
		this.currentMap = currentMap;
		this.mapPartX = mapPartX;
		this.mapPartY = mapPartY;
		this.level = level;
		this.opacity = 1;

		// 07 create Path instances from sliced Map
		const paths: Array<Array<Path>> = [];
		for (let y = 0; y < this.currentMap.length; y++) {
			paths.push([]);
			for (let x = 0; x < this.currentMap[y].length; x++) {
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
				const path = new Path(this.level, xPos, yPos, renderPosX, renderPosY);
				path.generate(this.mapPartX, this.mapPartY);
				paths[y].push(path);
			}
		}

		// console.log(paths);
		this.paths = paths;
	}

	update() {}

	render() {
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
	}
}

import { CanvasRendering } from '@/script/interface/state/CanvasRendering';
import { Path } from '@/script/object/world/Path';
import { PlayerWalkState } from '@/script/state/entity/player/PlayerWalkState';
import { SystemError } from '@/script/system/error/SystemError';
import { Level } from '@/script/world/Level';
import { MazeObjectType } from '@/script/world/internal/Maze';

export class MapPart implements CanvasRendering {
	map: MazeObjectType[][];
	mapPartX: number;
	mapPartY: number;
	level: Level;
	paths: Path[][];
	opacity: number;
	constructor(map: MazeObjectType[][], mapPartX: number, mapPartY: number, level: Level) {
		this.map = map;
		this.mapPartX = mapPartX;
		this.mapPartY = mapPartY;
		this.level = level;
		this.opacity = 1;

		const paths: Array<Array<Path>> = [];
		for (let y = 0; y < this.map.length; y++) {
			paths.push([]);
			for (let x = 0; x < this.map[y].length; x++) {
				const renderPosX = x;
				const renderPosY = y;
				const xPos = mapPartX * 15 + x;
				const yPos = mapPartY * 8 + y;
				const path = new Path(this.level, xPos, yPos, renderPosX, renderPosY);
				path.generate(this.mapPartX, this.mapPartY);
				paths[y].push(path);
			}
		}

		this.paths = paths;
	}

	update() {
		let isCancelPlayer = false;

		// Do not check collision if Player at idle state
		const player = this.level.world.player;
		if (player.stateMachine?.getCurrent() instanceof PlayerWalkState)
			for (const yRow of this.paths) {
				for (const path of yRow) {
					path.update();
					if (path.isPlayerCollided) {
						isCancelPlayer = true;

						// Here cancel the Player movement
						const playerDirection = this.level.world.player.direction;
						if (playerDirection === 'left') {
							this.level.world.player.x += 2;
						} else if (playerDirection === 'right') {
							this.level.world.player.x += -2;
						} else if (playerDirection === 'up') {
							this.level.world.player.y += 2;
						} else if (playerDirection === 'down') {
							this.level.world.player.y += -2;
						}
						break;
					}
				}
				if (isCancelPlayer) break;
			}
	}

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

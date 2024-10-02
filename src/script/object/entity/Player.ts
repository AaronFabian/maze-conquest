import { Level } from '@/script/world/Level';

export class Player {
	level: Level;
	x: number;
	y: number;

	constructor(level: Level) {
		this.level = level;
		this.x = 0;
		this.y = 0;
	}
}

import { EntityDef } from '@/script/interface/entity/EntityDef';
import { Level } from '@/script/world/Level';
import { Entity } from './Entity';
import { World } from '@/script/world/World';

export class Player extends Entity {
	level: World;
	x: number;
	y: number;
	xCoord: number;
	yCoord: number;

	constructor(def: EntityDef, level: World) {
		super(def);
		this.level = level;
		this.x = 0;
		this.y = 0;

		// ! Caution: Currently not live update the coordinate
		this.xCoord = 1;
		this.yCoord = 1;
	}
}

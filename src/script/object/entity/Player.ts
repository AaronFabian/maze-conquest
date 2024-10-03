import { EntityDef } from '@/script/interface/entity/EntityDef';
import { Level } from '@/script/world/Level';
import { Entity } from './Entity';

export class Player extends Entity {
	level: Level;
	x: number;
	y: number;

	constructor(def: EntityDef, level: Level) {
		super(def);
		this.level = level;
		this.x = 0;
		this.y = 0;
	}
}

import { EntityDef } from '@/script/interface/entity/EntityDef';
import { Entity } from '@/script/object/entity/Entity';

export class Soldier extends Entity {
	constructor(def: EntityDef) {
		super(def);

		// override property
		this.direction = 'left';
	}
}

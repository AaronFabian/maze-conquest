import { Entity } from '@/script/object/entity/Entity';
import { EntityBaseState } from '@/script/state/entity/EntityBaseState';

export class EntityDeathState extends EntityBaseState {
	constructor(entity: Entity) {
		super(entity);
		this.entity.setAnimation = 'death-' + this.entity.direction;
	}
}

import { Entity } from '@/script/object/entity/Entity';
import { PlayerBaseState } from '@/script/state/entity/player/PlayerBaseState';

export class PlayerIdleState extends PlayerBaseState {
	constructor(entity: Entity) {
		super(entity);

		// By default Entity direction is down
		this.entity.setAnimation = 'idle-' + this.entity.direction;
	}
}

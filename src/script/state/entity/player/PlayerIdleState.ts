import { keyWasPressed } from '@/index';
import { Entity } from '@/script/object/entity/Entity';
import { PlayerBaseState } from '@/script/state/entity/player/PlayerBaseState';

export class PlayerIdleState extends PlayerBaseState {
	constructor(entity: Entity) {
		super(entity);

		// By default Entity direction is down
		this.entity.setAnimation = 'idle-' + this.entity.direction;
	}

	override update() {
		if (keyWasPressed('w')) {
			this.entity.direction = 'up';
			this.entity.changeState('walk');
		} else if (keyWasPressed('a')) {
			this.entity.direction = 'left';
			this.entity.changeState('walk');
		} else if (keyWasPressed('s')) {
			this.entity.direction = 'down';
			this.entity.changeState('walk');
		} else if (keyWasPressed('d')) {
			this.entity.direction = 'right';
			this.entity.changeState('walk');
		}
	}
}

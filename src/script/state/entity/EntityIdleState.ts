/*
  an generic entity class such as for NPC or enemy
*/

import { Entity } from '@/script/object/entity/Entity';
import { EntityBaseState } from '@/script/state/entity/EntityBaseState';

export class EntityIdleState extends EntityBaseState {
	waitDuration: number;
	waitTimer: number;

	constructor(entity: Entity) {
		super(entity);

		this.entity.setAnimation = 'idle-' + this.entity.direction;

		// used for AI waiting
		this.waitDuration = 0;
		this.waitTimer = 0;
	}

	override processAI(_params: any) {
		// if (this.waitDuration === 0) {
		// 	this.waitDuration = 100;
		// } else {
		// 	// record the frames elapsed since there is no dt in canvas
		// 	this.waitTimer++;
		// 	if (this.waitTimer > this.waitDuration) {
		// 		this.waitTimer = 0;
		// 		this.entity.changeState('attack');
		// 	}
		// }
	}
}

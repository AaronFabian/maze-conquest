import { input } from '@/global';
import { Entity } from '@/script/object/entity/Entity';
import { Player } from '@/script/object/entity/Player.js';
import { PlayerBaseState } from '@/script/state/entity/player/PlayerBaseState';
import { World } from '@/script/world/World.js';

export class PlayerWalkState extends PlayerBaseState {
	override entity!: Player;
	constructor(entity: Entity, public level: World) {
		super(entity);
		this.entity.setAnimation = 'walk-' + this.entity.direction;
	}

	override update() {
		let moving = false;
		let direction = this.entity.direction;
		const move = { x: 0, y: 0 };

		// Check keyboard input for movement, only 1 key allowed
		if (input.keyboard.isDown.w) {
			move.y = -2;
			direction = 'up';
			moving = true;
			this.entity.y += -2;
		} else if (input.keyboard.isDown.s) {
			move.y = 2;
			direction = 'down';
			moving = true;
			this.entity.y += 2;
		} else if (input.keyboard.isDown.a) {
			move.x = -2;
			direction = 'left';
			moving = true;
			this.entity.x += -2;
		} else if (input.keyboard.isDown.d) {
			move.x = 2;
			direction = 'right';
			moving = true;
			this.entity.x += 2;
		}

		if (moving) {
			// Update direction and animation if the direction changed
			if (this.entity.direction !== direction) {
				this.entity.direction = direction;
				this.entity.setAnimation = 'walk-' + this.entity.direction;
			}
		} else {
			// Set to idle state if no movement / no key pressed
			this.entity.changeState('idle');
		}
	}
}

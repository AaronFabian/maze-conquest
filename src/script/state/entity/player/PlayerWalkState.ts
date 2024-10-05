import { input } from '@/global';
import { Entity } from '@/script/object/entity/Entity';
import { PlayerBaseState } from '@/script/state/entity/player/PlayerBaseState';
import { Level } from '@/script/world/Level';

export class PlayerWalkState extends PlayerBaseState {
	constructor(entity: Entity, public level: Level) {
		super(entity);

		this.level = level;
		this.entity.setAnimation = 'walk-' + this.entity.direction;
	}

	override update() {
		let moving = false;
		let direction = this.entity.direction;
		const move = { x: 0, y: 0 };

		// Check keyboard input for movement
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
			// Check for collisions before moving
			let isCancelPlayer = false;
			for (const yRow of this.level.paths) {
				for (const path of yRow) {
					if (path.evaluate(this.level.world.player)) {
						isCancelPlayer = true;
						break;
					}
				}
				if (isCancelPlayer) break;
			}

			// Cancel Player movement if Player hit the collision box
			if (isCancelPlayer) {
				this.entity.x += -move.x;
				this.entity.y += -move.y;
			}

			// Update direction and animation if the direction changed
			if (this.entity.direction !== direction) {
				this.entity.direction = direction;
				this.entity.setAnimation = 'walk-' + this.entity.direction;
			}
		} else {
			// Set to idle state if no movement
			this.entity.changeState('idle');
		}
	}
}

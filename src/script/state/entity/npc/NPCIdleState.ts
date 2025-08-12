import { ctx } from '@/global';
import { keyWasPressed } from '@/index';
import { AABB } from '@/script/interface/game/AABB';
import { Entity } from '@/script/object/entity/Entity';
import { Player } from '@/script/object/entity/Player';
import { Hitbox } from '@/script/object/Hitbox';
import { EntityIdleState } from '@/script/state/entity/EntityIdleState';
import { PlayerWalkState } from '@/script/state/entity/player/PlayerWalkState';

export class NPCIdleState extends EntityIdleState {
	player: Player;
	talkTriggerBox: Hitbox;
	collisionBox: Hitbox;
	constructor(entity: Entity, player: Player) {
		super(entity);
		this.player = player;

		this.talkTriggerBox = new Hitbox(
			this.entity.x - 8,
			this.entity.y - 8,
			this.entity.width + 16,
			this.entity.height + 20,
			player,
			() => {}
		);

		this.collisionBox = new Hitbox(
			this.entity.x,
			this.entity.y,
			this.entity.width,
			this.entity.height,
			player,
			() => {}
		);
	}

	private checkCollision(box1: AABB, box2: AABB): boolean {
		return (
			box1.x < box2.x + box2.width &&
			box1.x + box1.width > box2.x &&
			box1.y < box2.y + box2.height &&
			box1.y + box1.height > box2.y
		);
	}

	override update() {
		const playerAABB: AABB = {
			x: this.player.x,
			y: this.player.y,
			width: this.player.width,
			height: this.player.height,
		};

		if (this.checkCollision(this.talkTriggerBox, playerAABB)) {
			if (keyWasPressed('Enter')) {
				this.entity.onInteract(this.entity, this.player);
			}
		}

		if (this.player.stateMachine!.getCurrent() instanceof PlayerWalkState) {
			if (this.checkCollision(this.collisionBox, playerAABB)) {
				this.player.cancelMovement();
			}
		}
	}

	override render() {
		super.render();

		// debug-purpose
		// ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
		// ctx.fillRect(this.talkTriggerBox.x, this.talkTriggerBox.y, this.talkTriggerBox.width, this.talkTriggerBox.height);
	}
}

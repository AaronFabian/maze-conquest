import { ctx } from '@/global';
import { AABB } from '@/script/interface/game/AABB';
import { Entity } from '@/script/object/entity/Entity';
import { Player } from '@/script/object/entity/Player';
import { Hitbox } from '@/script/object/Hitbox';
import { EntityIdleState } from '@/script/state/entity/EntityIdleState';

export class NPCIdleState extends EntityIdleState {
	player: Player;
	hitbox: Hitbox;
	constructor(entity: Entity, player: Player) {
		super(entity);
		this.player = player;
		this.hitbox = new Hitbox(
			this.entity.x - 8,
			this.entity.y - 8,
			this.entity.width + 16,
			this.entity.height + 20,
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

		if (this.checkCollision(this.hitbox, playerAABB)) {
			// ...
		}
	}

	override render() {
		super.render();
		ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
		ctx.fillRect(this.hitbox.x, this.hitbox.y, this.hitbox.width, this.hitbox.height);
	}
}

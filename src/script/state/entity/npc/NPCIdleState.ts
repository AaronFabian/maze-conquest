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
		this.hitbox = new Hitbox(this.entity.x, this.entity.y, this.entity.width, this.entity.height, player, () => {});
	}

	override update() {}
}

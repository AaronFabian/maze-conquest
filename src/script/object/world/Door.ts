import { ctx } from '@/global';
import { GAME_OBJECT_DEFS } from '@/script/interface/object/game_object_defs';
import { GameObject } from '@/script/object/GameObject';
import { Player } from '@/script/object/entity/Player';
import { World } from '@/script/world/World';

export class Door extends GameObject {
	player: Player;
	world: World;
	constructor(player: Player) {
		super(GAME_OBJECT_DEFS.door);

		this.player = player;
		this.world = this.player.level as World;
	}

	override render() {
		super.render();

		// debug-purpose
		ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
		ctx.fillRect(this.x, this.y, this.width, this.height);

		// ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
		// ctx.fillRect(this.triggerBtnX, this.triggerBtnY, this.triggerBtnWidth, this.triggerBtnHeight);
	}
}

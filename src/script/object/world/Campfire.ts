import { GAME_OBJECT_DEFS } from '@/script/interface/object/game_object_defs';
import { GameObject } from '@/script/object/GameObject';
import { Player } from '@/script/object/entity/Player';

export class Campfire extends GameObject {
	player: Player;
	constructor(player: Player) {
		super(GAME_OBJECT_DEFS.campfire);
		this.player = player;
	}
}

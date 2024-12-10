import { canvas, ctx } from '@/global';
import { keyWasPressed } from '@/index';
import { AABB } from '@/script/interface/game/AABB';
import { GAME_OBJECT_DEFS } from '@/script/interface/object/game_object_defs';
import { GameObject } from '@/script/object/GameObject';
import { Player } from '@/script/object/entity/Player';
import { World } from '@/script/world/World';

export class Door extends GameObject {
	player: Player;
	world: World;
	isColliding: boolean;

	// "door" param is referencing into current door instance
	onEnter: (door: Door) => void;
	constructor(player: Player, x: number, y: number, onEnter: (door: Door) => void) {
		super(GAME_OBJECT_DEFS.door);

		this.x = x;
		this.y = y;
		this.player = player;
		this.world = this.player.level as World;

		// Run when player touch this object
		this.onEnter = onEnter;
		this.isColliding = false;
	}

	private checkIsPlayerNear() {
		this.isColliding = false;
		// Using AABB
		const box1: AABB = {
			x: this.x,
			y: this.y,
			width: this.width,
			height: this.height,
		};
		const box2: AABB = {
			x: this.player.x,
			y: this.player.y,
			width: this.player.width,
			height: this.player.height,
		};

		if (this.checkCollision(box1, box2)) {
			this.isColliding = true;
			if (keyWasPressed('Enter')) {
				this.onEnter(this);
			}
		}
	}

	override update() {
		super.update();
		this.checkIsPlayerNear();
	}

	override render() {
		super.render();

		// debug-purpose
		// ctx.fillStyle = 'rgba(90, 34, 139, 0.6)';
		// ctx.fillRect(this.x, this.y, this.width, this.height);

		if (this.isColliding) {
			// Because the canvas at center the UI will looks not precise
			ctx.save();
			ctx.resetTransform();
			ctx.font = '16px zig';
			ctx.fillStyle = 'rgb(255,255,255)';
			ctx.fillText('Press Enter key to proceed', 38, canvas.height - 24);
			ctx.restore();
		}
	}
}

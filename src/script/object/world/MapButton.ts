import { TILE_SIZE } from '@/global';
import { AABB } from '@/script/interface/game/AABB';
import { CanvasRendering } from '@/script/interface/state/CanvasRendering';
import { SystemError } from '@/script/world/Error/SystemError';
import { Level } from '@/script/world/Level';
import { Event } from '@/utils';

export class MapButton implements CanvasRendering {
	direction: string;
	width: number;
	height: number;
	level: Level;
	xPos: number;
	yPos: number;
	offsetX: number;
	offsetY: number;
	constructor(direction: string, xPos: number, yPos: number, level: Level) {
		this.direction = direction;
		this.xPos = xPos;
		this.yPos = yPos;

		// Reference to current level
		this.level = level;

		// Determine the width and height based  on direction and
		// determine offset where should be place the offset for AABB
		switch (direction) {
			case 'left':
				this.width = TILE_SIZE;
				this.height = TILE_SIZE * 3;
				this.offsetX = 0;
				this.offsetY = TILE_SIZE;
				break;
			case 'right':
				this.width = TILE_SIZE;
				this.height = TILE_SIZE * 3;
				this.offsetX = TILE_SIZE * 4;
				this.offsetY = TILE_SIZE;
				break;
			case 'top':
				this.width = TILE_SIZE * 3;
				this.height = TILE_SIZE;
				this.offsetX = TILE_SIZE;
				this.offsetY = 0;
				break;
			case 'bottom':
				this.width = TILE_SIZE * 3;
				this.height = TILE_SIZE;
				this.offsetX = TILE_SIZE;
				this.offsetY = TILE_SIZE * 4;
				break;
			default:
				throw new SystemError('[MapButton] Failed to init the MapButton, Unexpected direction');
		}
	}

	update() {
		// Using AABB
		const box1: AABB = {
			// Path
			x: (this.xPos - this.level.currentMapPartX! * 15) * 80 + this.offsetX,
			y: (this.yPos - this.level.currentMapPartY! * 8) * 80 + this.offsetY,
			width: this.width,
			height: this.height,
		};
		const box2: AABB = {
			// Player
			x: this.level.world.player.x,
			y: this.level.world.player.y,
			width: this.level.world.player.width,
			height: this.level.world.player.height,
		};
		// If the Player hit the button then shift based on this MapButton
		if (this.checkCollision(box1, box2)) {
			let nextMapPartX = this.level.currentMapPartX!;
			let nextMapPartY = this.level.currentMapPartY!;
			if (this.direction === 'left') {
				nextMapPartX -= 1;
			} else if (this.direction === 'right') {
				nextMapPartX += 1;
			} else if (this.direction === 'top') {
				nextMapPartY -= 1;
			} else if (this.direction === 'bottom') {
				nextMapPartY += 1;
			}

			// Save the map part coordinate for later shifting
			this.level.nextMapPartX = nextMapPartX;
			this.level.nextMapPartY = nextMapPartY;

			// Begin event for shifting camera
			Event.dispatch('shift-' + this.direction);
		}
	}

	render() {}

	onCollide() {}

	private checkCollision(box1: AABB, box2: AABB): boolean {
		return (
			box1.x < box2.x + box2.width &&
			box1.x + box1.width > box2.x &&
			box1.y < box2.y + box2.height &&
			box1.y + box1.height > box2.y
		);
	}
}

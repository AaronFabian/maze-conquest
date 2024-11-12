import { AABB } from '@/script/interface/game/AABB';
import { CanvasRendering } from '@/script/interface/state/CanvasRendering';
import { Player } from '@/script/object/entity/Player';

export class Hitbox implements AABB, CanvasRendering {
	constructor(
		public x: number,
		public y: number,
		public width: number,
		public height: number,
		public player: Player,
		public onHit: () => void
	) {}

	update() {}

	render() {}
}

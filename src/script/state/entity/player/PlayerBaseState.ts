import { ctx } from '@/global';
import { EntityBaseState } from '@/script/state/entity/EntityBaseState';

export class PlayerBaseState extends EntityBaseState {
	override render() {
		super.render();

		// debug-purpose
		ctx.fillStyle = 'rgba(0, 0, 255, 0.2)';
		ctx.fillRect(this.entity.x, this.entity.y, this.entity.width, this.entity.height);
	}
}

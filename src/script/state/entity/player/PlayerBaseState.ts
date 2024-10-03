import { _QuadImage } from '@/utils';
import { ctx } from '@/global';
import { EntityIdleState } from '@/script/state/entity/EntityIdleState';

const _window = window as any;

export class PlayerBaseState extends EntityIdleState {
	override render() {
		const anim = this.entity.currentAnimation;

		const quad = _window.gFrames.get(anim!.texture)[anim!.getCurrentFrame()] as _QuadImage;
		quad.drawImage(ctx, this.entity.x + this.entity.renderOffSetX, this.entity.y + this.entity.renderOffSetX);

		// debug-purpose
		ctx.fillStyle = 'rgba(0, 0, 255, 0.2)';
		ctx.fillRect(this.entity.x, this.entity.y, this.entity.width, this.entity.height);
	}
}

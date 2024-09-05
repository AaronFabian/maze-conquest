import { ctx } from '../../../global';
import { _QuadImage, worldToPixel } from '../../../utils';
import { Entity } from '../../entity/Entity';
import { CanvasRendering } from '../../interface/states/CanvasRendering';

const _window = window as any;

export class EntityBaseState implements CanvasRendering {
	constructor(public entity: Entity) {}
	update() {}
	enter(_params: any) {}
	exit() {}

	render() {
		const anim = this.entity.currentAnimation;

		const quad = _window.gFrames.get(anim!.texture)[anim!.getCurrentFrame()] as _QuadImage;
	}

	processAI(_params: any) {
		// used for states can be controlled by the AI that influenced update logic
		// some entity may have different update logic
	}

	debugWorld() {
		// this will render DIFFERENT
		// this debug is where the first position this entity will render

		ctx.beginPath();
		ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
		ctx.lineWidth = 1;
		ctx.rect(this.entity.x, this.entity.y, this.entity.width, this.entity.height);
		ctx.stroke();
	}
}

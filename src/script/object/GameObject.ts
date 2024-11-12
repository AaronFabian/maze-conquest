import { ctx } from '@/global';
import { AABB } from '@/script/interface/game/AABB';
import { AnimationDef } from '@/script/interface/game/AnimationDef';
import { GameObjectDef } from '@/script/interface/object/GameObjectDef';
import { CanvasRendering } from '@/script/interface/state/CanvasRendering';
import { _QuadImage, Animation } from '@/utils';

const _window = window as any;

export class GameObject implements CanvasRendering {
	x: number;
	y: number;
	width: number;
	height: number;
	animations: Map<string, Animation>;
	currentAnimation!: Animation;
	constructor(def: GameObjectDef) {
		// TODO: Refactor other class that extends this
		this.x = def.x;
		this.y = def.y;
		this.width = def.width;
		this.height = def.height;
		this.animations = this.createAnimations(def.animations);

		// If the animation not set then the default animation will be 'default'
		// Warning may cause error if the 'default' texture undefined
		this.setAnimation = 'default';
	}

	set setAnimation(name: string) {
		this.currentAnimation = this.animations.get(name)!;
	}

	protected createAnimations(animations: any): Map<string, Animation> {
		const animationsReturned = new Map<string, Animation>();

		for (const key of Object.keys(animations)) {
			const animationDef: AnimationDef = {
				texture: animations[key].texture || 'entities',
				frames: animations[key].frames,
				interval: animations[key].interval,
				looping: animations[key].looping || false,
				stopAtFinish: animations[key].stopAtFinish || false,
			};

			animationsReturned.set(key, new Animation(animationDef));
		}

		return animationsReturned;
	}

	checkCollision(box1: AABB, box2: AABB): boolean {
		return (
			box1.x < box2.x + box2.width &&
			box1.x + box1.width > box2.x &&
			box1.y < box2.y + box2.height &&
			box1.y + box1.height > box2.y
		);
	}

	update() {
		this.currentAnimation.update();
	}

	render() {
		const anim = this.currentAnimation;

		const quad = _window.gFrames.get(anim!.texture)[anim!.getCurrentFrame()] as _QuadImage;
		quad.drawImage(ctx, this.x, this.y);
	}
}

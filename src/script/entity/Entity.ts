import { Animation } from '../../utils';
import { EntityDef } from '../interface/entity/EntityDef';
import { AnimationDefInterface } from '../interface/game/AnimationDefInterface';
import { CanvasRendering } from '../interface/states/CanvasRendering';
import { StateMachine } from '../states/StateMachine';
import { EntityBaseState } from '../states/entity/EntityBaseState';

export class Entity implements CanvasRendering {
	HP: number;
	direction: string;
	animations: Map<string, Animation>;
	x: number;
	y: number;
	width: number;
	height: number;
	renderOffSetX: number;
	renderOffSetY: number;

	// late init !
	stateMachine?: StateMachine<EntityBaseState>;
	currentAnimation?: Animation;

	constructor(def: EntityDef) {
		this.HP = def.HP;
		this.direction = 'up';
		this.animations = this.createAnimations(def.animations);

		// x, y only for initializer because we calculate our pixel by Box2D
		this.x = def.x;
		this.y = def.y;

		this.width = def.width;
		this.height = def.height;

		this.renderOffSetX = def.renderOffSetX ?? 0;
		this.renderOffSetY = def.renderOffSetY ?? 0;
	}

	onInteract() {}

	onDestroy() {}

	damage(value: number) {
		this.HP -= value;
	}

	processAI(params: any) {
		this.stateMachine!.processAI(params);
	}

	set setStateMachine(stateMachine: StateMachine<EntityBaseState>) {
		this.stateMachine = stateMachine;
	}

	set setAnimation(name: string) {
		this.currentAnimation = this.animations.get(name)!;
	}

	set setDirection(direction: string) {
		this.direction = direction;
	}

	changeState(name: string, enterParams: any = {}) {
		this.stateMachine!.changeState(name, enterParams);
	}

	protected createAnimations(animations: any): Map<string, Animation> {
		const animationsReturned = new Map<string, Animation>();

		for (const key of Object.keys(animations)) {
			const animationDef: AnimationDefInterface = {
				texture: animations[key].texture || 'entities',
				frames: animations[key].frames,
				interval: animations[key].interval,
				looping: animations[key].looping || false,
			};

			animationsReturned.set(key, new Animation(animationDef));
		}

		return animationsReturned;
	}

	update() {
		this.currentAnimation!.update();
		this.stateMachine!.update();
	}

	render() {
		this.stateMachine!.render();
	}
}

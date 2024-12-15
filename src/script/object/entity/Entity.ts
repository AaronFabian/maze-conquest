import { EntityDef } from '@/script/interface/entity/EntityDef';
import { AnimationDef } from '@/script/interface/game/AnimationDef';
import { CanvasRendering } from '@/script/interface/state/CanvasRendering';
import { StateMachine } from '@/script/state/StateMachine';
import { EntityBaseState } from '@/script/state/entity/EntityBaseState';
import { Animation } from '@/utils';

export class Entity implements CanvasRendering {
	HP: number;
	isAlive: boolean;
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
	onInteract: (obj: Entity, other: Entity) => void;

	constructor(def: EntityDef) {
		this.HP = def.HP;
		this.isAlive = true;
		this.direction = 'down';
		this.animations = this.createAnimations(def.animations);

		this.x = def.x;
		this.y = def.y;

		this.width = def.width;
		this.height = def.height;

		this.renderOffSetX = def.renderOffSetX ?? 0;
		this.renderOffSetY = def.renderOffSetY ?? 0;

		this.onInteract = def.onInteract ?? function () {};
	}

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

	update() {
		this.currentAnimation!.update();
		this.stateMachine!.update();
	}

	render() {
		this.stateMachine!.render();
	}
}

// this StateMachine is a bit different from StateStack
// in this StateMachine, we import EntityBaseState, WeaponBaseState
// while in StateStack we use BaseState
import { CanvasRendering } from '@/script/interface/state/CanvasRendering';
import { EntityBaseState } from '@/script/state/entity/EntityBaseState';

// StateMachine accept 2 state type
type StateType = EntityBaseState;

export class StateMachine<T extends StateType> implements CanvasRendering {
	private states: Map<string, () => T>;
	private current: T;

	constructor(states: Map<string, () => T>) {
		const empty = <T>{
			enter(_params: any) {},
			update() {},
			render() {},
			exit() {},
		};

		this.current = empty;
		this.states = states;
	}

	changeState(stateName: string, enterParams: any) {
		if (!this.states.has(stateName)) throw new Error('Fatal error; state must exist !');

		this.current.exit();
		this.current = this.states.get(stateName)!();
		this.current.enter(enterParams);
	}

	update() {
		this.current.update();
	}

	render() {
		this.current.render();
	}

	processAI(params: any) {
		this.current.processAI(params);
	}

	getCurrent(): T {
		return this.current;
	}

	get size(): number {
		return this.states.size;
	}
}

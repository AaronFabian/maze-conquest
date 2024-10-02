import { BaseState } from '@/script/state/BaseState';

export class StateStack {
	private states: Array<BaseState> = [];

	update() {
		this.states[this.states.length - 1].update();
	}

	processAI() {
		this.states.forEach(state => state.processAI());
	}

	render() {
		this.states.forEach(state => state.render());
	}

	push(state: BaseState) {
		this.states.push(state);
		state.enter({});
	}

	pop() {
		this.states[this.states.length - 1].exit();
		this.states.pop();
	}

	get length() {
		return this.states.length;
	}
}

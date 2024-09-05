import { TWEEN, canvas, ctx } from '../../../global';
import { keyWasPressed } from '../../../index';
import { BaseState } from '../BaseState';

const _window = window as any;

export class GameState extends BaseState {
	constructor() {
		super();

		console.log('%c -game state-', 'color: #30AEBF;');
	}

	override update() {}

	override render() {}

	override exit() {
		TWEEN.removeAll();
	}
}

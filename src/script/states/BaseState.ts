import { CanvasRendering } from '../interface/states/CanvasRendering';

export class BaseState implements CanvasRendering {
	enter(_enterParams: any) {}
	update() {}
	processAI() {}
	render() {}
	exit() {}
}

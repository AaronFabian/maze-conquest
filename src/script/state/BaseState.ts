/**
 * This base class for state machine
 */

import { CanvasRendering } from '@/script/interface/state/CanvasRendering';

export abstract class BaseState implements CanvasRendering {
	enter(_enterParams: any) {}
	update() {}
	processAI() {}
	render() {}
	exit() {}
}

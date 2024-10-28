/**
 * This class just a base class that Player could exploring
 */

import { CanvasRendering } from '@/script/interface/state/CanvasRendering';

export enum WorldType {
	Level = 'level',
	Town = 'town',
}

export abstract class World implements CanvasRendering {
	setup() {}

	update() {}

	render() {}
}

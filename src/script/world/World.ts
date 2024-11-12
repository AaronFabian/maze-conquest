/**
 * This class just a base class that Player could exploring
 */

import { CanvasRendering } from '@/script/interface/state/CanvasRendering';
import { Player } from '@/script/object/entity/Player';

export enum WorldType {
	Level = 'level',
	Town = 'town',
}

export abstract class World implements CanvasRendering {
	setup() {}

	update() {}

	render() {}
}

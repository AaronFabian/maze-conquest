export interface GameObjectDef {
	x: number;
	y: number;
	width: number;
	height: number;
	animations: any;

	// the render offset could hardcode
	renderOffSetX?: number;
	renderOffSetY?: number;
}

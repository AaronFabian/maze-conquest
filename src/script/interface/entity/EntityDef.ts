export interface EntityDef {
	HP: number;
	animations: any;
	x: number;
	y: number;
	width: number;
	height: number;

	// the render offset could hardcode
	renderOffSetX?: number;
	renderOffSetY?: number;
}

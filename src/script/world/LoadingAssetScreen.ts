import { canvas, ctx } from '../../global';

export class LoadingAssetScreen {
	asset: Promise<HTMLImageElement>[];
	assetLoaded: number;

	constructor(asset: Promise<any>[]) {
		this.asset = asset;
		this.assetLoaded = 0;
	}

	render() {
		ctx.fillStyle = 'black';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// text to present how many asset have been loaded
		ctx.font = '8px zig';
		ctx.fillStyle = `rgba(255,255,255, 1)`;
		ctx.textAlign = 'center';
		ctx.fillText(`Loading ${this.assetLoaded} of ${this.asset.length}`, canvas.width / 2, canvas.height / 2);

		// loading bar
		ctx.strokeStyle = `rgba(255,255,255,1)`;
		ctx.rect(0 + 100, canvas.height / 2 + 12, canvas.width - 200, 8);
		ctx.stroke();

		ctx.fillStyle = `rgba(255,255,255,0.8)`;
		ctx.fillRect(0 + 100, canvas.height / 2 + 12, (canvas.width - 200) * (this.assetLoaded / this.asset.length), 6);
	}
}

import { canvas, ctx } from '@/global';

/*
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
			ctx.font = '32px zig';
			ctx.fillStyle = `rgba(255,255,255, 1)`;
			ctx.textAlign = 'center';
			ctx.fillText(`Loading ${this.assetLoaded} of ${this.asset.length}`, canvas.width / 2, canvas.height / 2);

			// loading bar
			ctx.strokeStyle = `rgba(255,255,255,1)`;
			ctx.rect(0 + 100, canvas.height / 2 + 36, canvas.width - 200, 8);
			ctx.stroke();

			ctx.fillStyle = `rgba(255,255,255,0.8)`;
			ctx.fillRect(0 + 100, canvas.height / 2 + 36, (canvas.width - 200) * (this.assetLoaded / this.asset.length), 6);
		}
	}
*/

export class _LoadingAssetsScreen<T> {
	assets: Promise<T>[];
	assetsLoaded: number;
	constructor() {
		this.assets = [];
		this.assetsLoaded = 0;
	}

	push(asset: T) {
		if (asset instanceof HTMLImageElement) {
			this.assets.push(
				new Promise<T>((resolve, reject) => {
					asset.onerror = e => reject(e);
					asset.onload = () => {
						this.assetsLoaded += 1;
						this.render();
						resolve(asset);
					};
				})
			);

			return;
		}

		this.assets.push(new Promise<T>(() => asset));
		console.warn('[System Warning] Unknown assets loaded');
	}

	async load(onEachAssetLoaded: (asset: T) => void) {
		const loadedAssets = await Promise.all(this.assets);
		loadedAssets.forEach(asset => onEachAssetLoaded(asset));
	}

	render() {
		ctx.fillStyle = 'black';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// text to present how many asset have been loaded
		ctx.font = '32px zig';
		ctx.fillStyle = `rgba(255,255,255, 1)`;
		ctx.textAlign = 'center';
		ctx.fillText(`Loading ${this.assetsLoaded} of ${this.assets.length}`, canvas.width / 2, canvas.height / 2);

		// loading bar
		ctx.strokeStyle = `rgba(255,255,255,1)`;
		ctx.rect(0 + 100, canvas.height / 2 + 36, canvas.width - 200, 8);
		ctx.stroke();

		ctx.fillStyle = `rgba(255,255,255,0.8)`;
		ctx.fillRect(0 + 100, canvas.height / 2 + 36, (canvas.width - 200) * (this.assetsLoaded / this.assets.length), 6);
	}
}

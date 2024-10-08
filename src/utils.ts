// utility function and class

import { PTM, Howl, canvas } from '@/global';
import { LoadingAssetScreen } from '@/script/world/LoadingAssetScreen.js';

export class Animation {
	frames: number[];
	interval: number;
	texture: string;
	looping: boolean;
	timer: number;
	currentFrame: number;
	timesPlayed: number;
	stopAtFinish: boolean;

	constructor(def: any) {
		this.frames = def.frames;
		this.interval = def.interval;
		this.texture = def.texture;
		this.looping = def.looping;
		this.stopAtFinish = def.stopAtFinish;

		this.timer = 0;
		this.currentFrame = 1;

		// used to see if we've seen a whole loop of the animation
		this.timesPlayed = 0;
	}

	refresh() {
		this.timer = 0;
		this.currentFrame = 1;
		this.timesPlayed = 0;
	}

	update() {
		// if not looping animation and we've played at least once, exit !
		if (!this.looping && this.timesPlayed > 0) return;

		// no need update if animation only 1 frame
		if (this.frames.length === 1) return;

		this.timer += 1;

		// if the timer is gt than interval than means we go to next frames.
		if (this.timer > this.interval) {
			this.timer %= this.interval;

			// increment the currentFrame by 1, if the currentFrame === frames.length + 1 then restart to one
			// the reason why length + 1 is for example
			// [0, 1, 2] -> length: 3
			// if we modulo by 3 then only [0, 1] will be rendered
			this.currentFrame = Math.max(1, (this.currentFrame + 1) % (this.frames.length + 1));

			// if we've looped; back to the beginning, record
			if (this.currentFrame === 1) {
				this.timesPlayed += 1;
			}
		}
	}

	getCurrentFrame() {
		return this.frames[this.currentFrame - 1];
	}
}

export class _QuadImage {
	constructor(
		public image: HTMLImageElement,
		public sx: number,
		public sy: number,
		public width: number,
		public height: number
	) {}

	drawImage(context: CanvasRenderingContext2D, dx: number, dy: number) {
		context.drawImage(this.image, this.sx, this.sy, this.width, this.height, dx, dy, this.width, this.height);
	}
}

export class Event {
	static on(eventName: string, cb: () => void) {
		document.addEventListener(eventName, cb);
	}

	static dispatch(eventName: string) {
		const event = new window.Event(eventName);
		document.dispatchEvent(event);
	}
}

export function pixelToWorld(inPx: number): number {
	return inPx / PTM;
}

export function worldToPixel(inWp: number): number {
	return inWp * PTM;
}

export function generateQuads(image: HTMLImageElement, tileWidth: number, tileHeight: number): Array<_QuadImage> {
	const imgWidth = image.width / tileWidth;
	const imgHeight = image.height / tileHeight;

	const spriteSheet: _QuadImage[] = [];

	for (let y = 0; y < imgHeight; y++)
		for (let x = 0; x < imgWidth; x++)
			spriteSheet.push(new _QuadImage(image, x * tileWidth, y * tileHeight, tileWidth, tileHeight));

	return spriteSheet;
}

export function newQuad(image: HTMLImageElement, sx: number, sy: number, width: number, height: number): _QuadImage {
	return new _QuadImage(image, sx, sy, width, height);
}

// export function newImage(src: string, alt: string): Promise<HTMLImageElement> {
// 	const imgElement = new Image();
// 	imgElement.src = src;
// 	imgElement.alt = alt;

// 	return new Promise((resolve, reject) => {
// 		imgElement.onload = () => resolve(imgElement);
// 		imgElement.onerror = e => reject(e);
// 	});
// }

export function newHowler(src: string, loop: boolean = false): Promise<unknown> {
	return new Promise((resolve, reject) => {
		const howl = new Howl({
			src: [src],
			loop: loop,
			onload: () => resolve(howl),
			onerror: (error: Error) => reject(error),
		});
	});
}

// under experiment
export function newImage(src: string, alt: string, state: LoadingAssetScreen): Promise<HTMLImageElement> {
	const imgElement = new Image();
	imgElement.src = src;
	imgElement.alt = alt;

	return new Promise((resolve, reject) => {
		imgElement.onerror = e => reject(e);
		imgElement.onload = () => {
			state.assetLoaded += 1;
			state.render();
			resolve(imgElement);
		};
	});
}

export function random(from: number = 0, to: number = 1) {
	return Math.floor(Math.random() * (to - from + 1)) + from;
}

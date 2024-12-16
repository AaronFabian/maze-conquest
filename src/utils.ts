// utility function and class

import { Howl } from '@/global';
import { AnimationDef } from '@/script/interface/game/AnimationDef';
import { UserDef } from '@/script/interface/system/UserDef';
import { User } from '@/script/system/model/User';
import { DocumentData } from 'firebase/firestore';

export class Animation {
	frames: number[];
	interval: number;
	texture: string;
	looping: boolean;
	timer: number;
	currentFrame: number;
	timesPlayed: number;
	stopAtFinish: boolean;

	constructor(def: AnimationDef) {
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
		if (this.stopAtFinish && this.timesPlayed >= 1) {
			this.currentFrame = this.frames.length;
			return;
		}

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
	private static registeredEvent: Map<string, () => void> = new Map();
	static on(eventName: string, cb: () => void) {
		if (Event.registeredEvent.has(eventName)) {
			Event.clean(eventName);
		}
		window.addEventListener(eventName, cb);
		Event.registeredEvent.set(eventName, cb);
	}

	static dispatch(eventName: string) {
		const event = new window.Event(eventName);
		window.dispatchEvent(event);
	}

	private static clean(eventName: string) {
		if (!Event.registeredEvent.get(eventName))
			throw new Error('Unexpected behavior. Unsafe memory detected when registering the event at window');

		window.removeEventListener(eventName, Event.registeredEvent.get(eventName)!);
	}
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

/*
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
*/

export function _newImage(src: string, alt: string) {
	const imgElement = new Image();
	imgElement.src = src;
	imgElement.alt = alt;

	return imgElement;
}

export function random(from: number = 0, to: number = 1): number {
	return Math.floor(Math.random() * (to - from + 1)) + from;
}

export function getWrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
	const words = text.split(' ');
	let lines: string[] = [];
	let currentLine = '';

	words.forEach(word => {
		const testLine: string = currentLine + word + ' ';
		const metrics: TextMetrics = ctx.measureText(testLine);
		const testWidth: number = metrics.width;

		if (testWidth > maxWidth && currentLine !== '') {
			lines.push(currentLine);
			currentLine = word + ' ';
		} else {
			currentLine = testLine;
		}
	});

	if (currentLine) {
		lines.push(currentLine.trim());
	}

	return lines;
}

export function sleep(sleepTimeInMs: number): Promise<void> {
	return new Promise<void>((res, _) => setTimeout(res, sleepTimeInMs));
}

export function padNum(val: number, fillString: string, maxFill: number = 2): string {
	return val.toString().padStart(maxFill, fillString);
}

/* 
export async function hashMessage(msg: string) {
	const encoder = new TextEncoder();
	const data = encoder.encode(msg);
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
	
	return hashHex;
}
*/

export function validateBeforeSave(data: any): boolean {
	if (data.items === undefined) return false;
	if (data.worlds === undefined) return false;
	if (data.allHeroes === undefined) return false;
	if (data.party === undefined || data.party.length <= 0) return false;

	return true;
}

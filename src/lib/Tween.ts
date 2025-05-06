/**
 * Give Tween library type
 */

export class Tween {
	private readonly _window = window as any;
	private readonly Tw = this._window.TWEEN.Tween;
	private tw: any;
	constructor(obj: any) {
		this.tw = new this.Tw(obj);
	}

	to(whatTo: { [key: string]: number }, duration: number = 1000) {
		this.tw.to(whatTo, duration);
		return this;
	}

	onComplete(fn: () => void) {
		this.tw.onComplete(fn);
		return this;
	}

	chain(tw: Tween) {
		const otherTw = tw;
		this.tw.chain(otherTw.tw);
	}

	start = () => this.tw.start();
}

import { PTM, Tween, canvas, ctx } from '../../../global';
import { keyWasPressed } from '../../../index';
import { pixelToWorld } from '../../../utils';
import { BaseState } from '../BaseState';
import { CurtainCloseState } from './CurtainCloseState';
import { CurtainOpenState } from './CurtainOpenState';
import { GameState } from './GameState';

const _window = window as any;

export class StartState extends BaseState {
	private blink: boolean = false;
	private blinkOpacity: number = 1;
	private blinkIntervalId: NodeJS.Timeout;

	constructor() {
		super();

		this.blinkIntervalId = setInterval(() => {
			new Tween(this)
				.to({ blinkOpacity: this.blink ? 1 : 0 }, 1000)
				.onComplete(() => (this.blink = !this.blink))
				.start();
		}, 1000);

		console.log('-game start-');
	}

	override update() {
		if (keyWasPressed('Enter'))
			_window.gStateStack.push(
				new CurtainCloseState(250, 750, () => {
					// the CurtainCloseState will auto pop when finish animating

					// pop StartState
					_window.gStateStack.pop();

					// push the GameState
					_window.gStateStack.push(new GameState());

					// push the CurtainOpenState so GameState will be behind the curtain
					_window.gStateStack.push(new CurtainOpenState(250, 750, () => {}));
				})
			);
	}

	override render() {
		ctx.save();

		ctx.drawImage(_window.gImages.get('start-screen-bg'), 0, 0);

		ctx.font = '32px zig';
		ctx.fillStyle = `rgba(255,255,255, ${this.blinkOpacity})`;
		ctx.textAlign = 'center';
		ctx.fillText('push enter button', canvas.width / 2, canvas.height / 2);

		ctx.restore();
	}

	override exit = () => clearInterval(this.blinkIntervalId);
}

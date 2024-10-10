import { Tween, canvas, ctx } from '@/global';
import { keyWasPressed } from '@/index';
import { BaseState } from '@/script/state/BaseState';
import { CurtainOpenState } from '@/script/state/game/CurtainOpenState';
import { FadeInState } from '@/script/state/game/FadeInState';
import { GameState } from '@/script/state/game/GameState';

const _window = window as any;

enum LocalScreen {
	START_SCREEN = 1,
	MENU_SCREEN = 2,
}

export class StartState extends BaseState {
	private blink: boolean = false;
	private blinkOpacity: number = 1;
	private blinkIntervalId: NodeJS.Timeout;
	private localScreen: LocalScreen;
	private cursor: number;

	constructor() {
		super();

		// this.localScreen = LocalScreen.START_SCREEN;
		this.localScreen = LocalScreen.MENU_SCREEN;
		this.cursor = 1;

		this.blinkIntervalId = setInterval(() => {
			new Tween(this)
				.to({ blinkOpacity: this.blink ? 1 : 0 }, 1000)
				.onComplete(() => (this.blink = !this.blink))
				.start();
		}, 1000);
	}

	override update() {
		if (keyWasPressed('Enter')) {
			if (this.localScreen === LocalScreen.START_SCREEN) {
				this.localScreen = LocalScreen.MENU_SCREEN;
				this.cursor = 1;
			} else if (this.localScreen === LocalScreen.MENU_SCREEN) {
				if (this.cursor === 1) {
					_window.gStateStack.push(
						new FadeInState({ r: 255, g: 255, b: 255 }, 1000, () => {
							// pop it self
							// ...

							// pop StartState (this)
							_window.gStateStack.pop();

							_window.gStateStack.push(new GameState());

							_window.gStateStack.push(new CurtainOpenState({ r: 155, g: 155, b: 155 }, 0, 2000, () => {}));
						})
					);
				}

				if (this.cursor === 2) {
					console.log('Go to BFS and DFS');
				}

				if (this.cursor === 3) {
					this.localScreen = LocalScreen.START_SCREEN;
				}
			}
		}

		if (keyWasPressed('w')) {
			if (this.cursor - 1 < 1) {
				this.cursor = 3;
			} else {
				this.cursor -= 1;
			}
		}

		if (keyWasPressed('s')) {
			if (this.cursor + 1 > 3) {
				this.cursor = 1;
			} else {
				this.cursor += 1;
			}
		}
	}

	override render() {
		ctx.drawImage(_window.gImages.get('start-screen-bg'), 0, 0);

		if (this.localScreen === LocalScreen.START_SCREEN) {
			ctx.font = '96px zig';
			ctx.fillStyle = `rgb(255,255,255)`;
			ctx.textAlign = 'center';
			ctx.fillText('Maze Conquest', canvas.width / 2, canvas.height / 2 - 104);

			ctx.font = '32px zig';
			ctx.fillStyle = `rgba(255,255,255, ${this.blinkOpacity})`;
			ctx.textAlign = 'center';
			ctx.fillText('push enter button', canvas.width / 2, canvas.height / 2 + 32);
		}

		if (this.localScreen === LocalScreen.MENU_SCREEN) {
			ctx.font = '32px zig';
			ctx.textAlign = 'center';
			ctx.fillStyle = `rgba(255,255,255, ${this.cursor === 1 ? 1 : 0.4})`;
			ctx.fillText('Start Game', canvas.width / 2, canvas.height / 2);
			ctx.fillStyle = `rgba(255,255,255, ${this.cursor === 2 ? 1 : 0.4})`;
			ctx.fillText('BFS and DFS Simulation', canvas.width / 2, canvas.height / 2 + 52);
			ctx.fillStyle = `rgba(255,255,255, ${this.cursor === 3 ? 1 : 0.4})`;
			ctx.fillText('Back', canvas.width / 2, canvas.height / 2 + 104);
		}

		ctx.font = '16px zig';
		ctx.textAlign = 'center';
		ctx.fillStyle = `rgb(255,255,255)`;
		ctx.fillText('© AARON FABIAN', canvas.width / 2, canvas.height - 24);
	}

	override exit = () => clearInterval(this.blinkIntervalId);
}

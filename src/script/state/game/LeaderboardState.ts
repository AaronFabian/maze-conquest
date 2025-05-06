/**
 * For small state like this, It's still maintainable using imperative
 * rendering, imperative doesn't mean unreadable.
 */

import { canvas, ctx, gStateStack, TWEEN, Tween } from '@/global';
import { keyWasPressed } from '@/index';
import { Text } from '@/script/gui/Text';
import { BaseState } from '@/script/state/BaseState';
import { FadeInState } from '@/script/state/game/FadeInState';
import { FadeOutState } from '@/script/state/game/FadeOutState';
import { StartState } from '@/script/state/game/StartState';
import { SystemError } from '@/script/system/error/SystemError';
import { mixStatsService } from '@/script/system/service/mixStatsService';

enum LocalScreen {
	Fetching,
	Idle,
	Error,
}

export class LeaderboardState extends BaseState {
	localScreen: LocalScreen = LocalScreen.Fetching;
	texts: Text[] = [];
	blink: number = 0;

	override enter(_: any) {
		this.startLeaderboardService();
	}

	private async startLeaderboardService() {
		try {
			const { value, error } = await mixStatsService.getLeaderboard();
			this.texts = [];

			if (error !== undefined) {
				const errorText = new Text({
					text: `Error: ${error.message}`,
					x: canvas.width / 2,
					y: 30,
					alignText: 'center',
					color: 'rgba(255, 0, 0, 1)',
				});
				this.texts.push(errorText);
				this.localScreen = LocalScreen.Error;
				return;
			}

			if (value === undefined) throw new Error('Unexpected undefined value at LeaderboardState');

			for (let i = 0; i < value.length; i++) {
				const mixStats = value[i];
				const nameText = new Text({
					text: `${i + 1}.${mixStats.ownerUsername}`,
					x: canvas.width - 200,
					y: canvas.height / 2 - 94 + 36 * (i + 1),
					alignText: 'left',
					maxWidth: canvas.width,
					color: 'rgba(255, 255, 255, 1)',
				});
				const powerText = new Text({
					text: `${mixStats.power}`,
					x: canvas.width + 200,
					y: canvas.height / 2 - 94 + 36 * (i + 1),
					alignText: 'left',
					maxWidth: canvas.width,
					color: 'rgba(255, 255, 255, 1)',
				});
				new Tween(nameText)
					.to({ x: canvas.width / 2 - 200 })
					.delay(i * 150)
					.start();
				new Tween(powerText)
					.to({ x: canvas.width / 2 + 200 })
					.delay(i * 150)
					.start();
				this.texts.push(nameText);
				this.texts.push(powerText);
			}

			const tween1 = new Tween(this).to({ blink: 1 }, 1000);
			const tween2 = new Tween(this).to({ blink: 0 }, 1000);
			tween1.chain(tween2);
			tween2.chain(tween1);

			tween1.delay(value.length * 150).start();

			this.localScreen = LocalScreen.Idle;
		} catch (error) {
			console.error(error);
			this.localScreen = LocalScreen.Error;
		}
	}

	override update() {
		if (keyWasPressed(' ')) {
			gStateStack.push(
				new FadeInState({ r: 255, g: 255, b: 255 }, 1000, () => {
					gStateStack.pop();

					gStateStack.push(new StartState());

					gStateStack.push(new FadeOutState({ r: 255, g: 255, b: 255 }, 2000, () => {}));
				})
			);
		}
	}

	override render() {
		ctx.font = '96px zig';
		ctx.fillStyle = `rgb(255, 255, 255)`;
		ctx.textAlign = 'center';
		ctx.fillText('Leaderboard', canvas.width / 2, canvas.height / 2 - 104);

		switch (this.localScreen) {
			case LocalScreen.Idle:
				ctx.font = '14px zig';
				ctx.fillStyle = `rgba(255, 255, 255, ${this.blink})`;
				ctx.textAlign = 'center';
				ctx.fillText('press space bar back to title screen', canvas.width / 2, canvas.height - 16);
				break;

			case LocalScreen.Fetching:
				ctx.font = '14px zig';
				ctx.fillStyle = `rgba(255, 255, 255, ${this.blink})`;
				ctx.textAlign = 'center';
				ctx.fillText('Loading data', canvas.width / 2, canvas.height / 2 + 96);
				break;

			case LocalScreen.Error:
				break;

			default:
				throw new SystemError('Unexpected error while rendering LeaderboardState');
		}

		for (const text of this.texts) {
			text.render();
		}
	}

	override exit = () => TWEEN.removeAll();
}

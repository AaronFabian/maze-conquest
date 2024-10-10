import { canvas, ctx } from '@/global';
import { BaseState } from '@/script/state/BaseState';

const _window = window as any;

export class BattleState extends BaseState {
	override update() {}

	override render() {
		ctx.fillStyle = 'rgba(0, 0, 0, 1)';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.drawImage(_window.gImages.get('level1-battlefield'), canvas.width / 2 - 608 / 2, canvas.height / 2 - 336 / 2);
	}
}

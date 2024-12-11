import { canvas, ctx } from '@/global';
import { keyWasPressed } from '@/index';
import { BaseState } from '@/script/state/BaseState';
import { User } from '@/script/system/model/User';
import { WorldType } from '@/script/world/World';

const _window = window as any;

export class WhileChangingWorldState extends BaseState {
	autoNextIn: number;
	value: number;
	constructor(private user: User, private world: string, private onNext: () => void) {
		super();
		this.value = 0;
		this.autoNextIn = 1000;
	}

	override update() {
		if (this.value > this.autoNextIn) {
			_window.gStateStack.pop();
			this.onNext();

			return;
		}

		if (keyWasPressed('Enter')) {
			_window.gStateStack.pop();
			this.onNext();
		}

		this.value++;
	}

	override render() {
		ctx.fillStyle = 'black';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.font = '32px zig';
		ctx.fillStyle = `rgba(255,255,255, 1)`;
		ctx.textAlign = 'center';
		if (this.world === WorldType.Town) {
			ctx.fillText('Beginning Town', canvas.width / 2, canvas.height / 2);
		}

		if (this.world === WorldType.Level) {
			ctx.fillText('Infinity Maze', canvas.width / 2, canvas.height / 2);

			ctx.font = '16px zig';
			ctx.fillText(`Lv.${this.user.worlds.get(WorldType.Level)}`, canvas.width / 2, canvas.height / 2 + 18);
		}
	}
}

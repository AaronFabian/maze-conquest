import { ctx, input } from '@/global';
import { ProgressBar } from '@/script/gui/ProgressBar';
import { ProgressBarDef } from '@/script/interface/game/ProgressBarDef';
import { BaseState } from '@/script/state/BaseState';

export class TutorialState extends BaseState {
	skipProgressBar: ProgressBar;
	constructor() {
		super();

		this.skipProgressBar = new ProgressBar({
			x: 10,
			y: 10,
			width: 250,
			height: 12,
			max: 250,
			color: { r: 255, g: 0, b: 0 },
			value: 0,
		});
	}

	override update() {
		// By default Player could skip tutorial
		if (input.keyboard.isDown['x']) {
			this.skipProgressBar.value = this.skipProgressBar.value + 2;
		} else {
			this.skipProgressBar.value = 0;
		}

		const enterTriggerHandiCap = 250;
		if (this.skipProgressBar.value >= enterTriggerHandiCap) {
			console.log('Skip tutorial state');
		}
	}

	override render() {
		if (this.skipProgressBar.value > 0) {
			this.skipProgressBar.render();
		} else {
			ctx.font = '12px zig';
			ctx.fillStyle = 'rgba(255, 255, 255, 1)';
			ctx.fillText('Hold x key to skip tutorial', 10, 20);
		}
	}
}

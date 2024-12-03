import { ctx, input, Tween } from '@/global';
import { ProgressBar } from '@/script/gui/ProgressBar';
import { ProgressBarDef } from '@/script/interface/game/ProgressBarDef';
import { BaseState } from '@/script/state/BaseState';
import { Forest } from '@/script/world/Forest';

export class TutorialState extends BaseState {
	skipProgressBar: ProgressBar;
	world: Forest;
	constructor() {
		super();

		this.skipProgressBar = new ProgressBar({
			x: 10,
			y: 10,
			width: 250,
			height: 12,
			max: 10,
			color: { r: 255, g: 0, b: 0 },
			value: 0,
		});

		// const action1 = new Tween(this).to();
		this.world = new Forest(this);

		this.world.setup();
	}

	override update() {
		this.world.update();

		// By default Player could skip tutorial
		if (input.keyboard.isDown.x) {
			this.skipProgressBar.value = this.skipProgressBar.value + 0.1;
		} else {
			this.skipProgressBar.value = 0;
		}

		const enterTriggerHandiCap = 10;
		if (this.skipProgressBar.value >= enterTriggerHandiCap) {
			console.log('Skip tutorial state');
		}
	}

	override render() {
		this.world.render();

		if (this.skipProgressBar.value > 0) {
			this.skipProgressBar.render();
		} else {
			ctx.font = '12px zig';
			ctx.fillStyle = 'rgba(255, 255, 255, 1)';
			ctx.fillText('Hold x key to skip tutorial', 10, 20);
		}
	}
}

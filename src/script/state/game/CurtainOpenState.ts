import { Tween, canvas, ctx } from '@/global';
import { BaseState } from '@/script/state/BaseState';

// this class only for UI and animation in our game so
// we don't need convert pixel to world
// but we have to be careful to see if canvas is already .restore() or not
// if not may be lead render confusion
export class CurtainOpenState extends BaseState {
	private curtainOpacity: number = 1;

	private topCurtainY: number;
	private bottomCurtainY: number;

	private color: { r: number; g: number; b: number };
	time: NodeJS.Timeout;

	constructor(
		color: { r: number; g: number; b: number },
		delay: number = 250,
		animateTime: number = 750,
		onFinished: Function = () => {}
	) {
		super();

		this.color = color;
		this.topCurtainY = 0;
		this.bottomCurtainY = canvas.height / 2;

		// setTimeout to avoid the lag
		this.time = setTimeout(() => {
			new Tween(this)
				.to({ bottomCurtainY: canvas.height, topCurtainY: -canvas.height / 2 }, animateTime)
				.onComplete(() => {
					// auto pop this state when finished
					(window as any).gStateStack.pop();

					// run the on Finished function given by the parameters
					onFinished();
				})
				.start();
		}, delay);
	}

	render() {
		const { r, g, b } = this.color;
		ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.curtainOpacity})`;
		ctx.fillRect(0, this.bottomCurtainY, canvas.width, canvas.height / 2);
		ctx.fillRect(0, this.topCurtainY, canvas.width, canvas.height / 2);
	}

	exit() {
		clearTimeout(this.time);
	}
}

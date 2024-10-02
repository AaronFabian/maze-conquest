import { Tween, canvas, ctx } from '@/global';
import { BaseState } from '@/script/state/BaseState';

export class CurtainCloseState extends BaseState {
	curtainOpacity: number = 1;
	topCurtainY: number;
	bottomCurtainY: number;

	constructor(delay: number, animateTime: number, onFinished: Function) {
		super();

		this.topCurtainY = -canvas.height / 2;
		this.bottomCurtainY = canvas.height;

		// setTimeout to avoid the lag
		setTimeout(() => {
			new Tween(this)
				.to({ bottomCurtainY: canvas.height / 2, topCurtainY: 0 }, animateTime)
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
		ctx.fillStyle = `rgba(255,255,255, ${this.curtainOpacity})`;
		ctx.fillRect(0, this.bottomCurtainY, canvas.width, canvas.height / 2);
		ctx.fillRect(0, this.topCurtainY, canvas.width, canvas.height / 2);
	}
}

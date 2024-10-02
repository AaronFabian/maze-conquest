import { canvas, ctx } from '@/global';

export class FatalErrorScreen {
	constructor(private error: Error) {
		let restartTimer = 10;

		this.errorScreen(restartTimer);

		const restartTimerId = setInterval(() => {
			if (restartTimer === 0) {
				console.log('game restarted');
				clearInterval(restartTimerId);
				document.location = '/';
			} else {
				restartTimer--;
				this.errorScreen(restartTimer);
			}
		}, 1000);
	}

	private errorScreen(timer: number) {
		ctx.reset();

		ctx.fillStyle = 'rgba(60, 0, 0)';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.font = '36px zig';
		ctx.fillStyle = `rgba(255,255,255, 1)`;
		ctx.textAlign = 'center';
		ctx.fillText('Fatal Error', canvas.width / 2, canvas.height / 2);

		ctx.font = '21px zig';
		ctx.fillStyle = `rgba(255,255,255, 1)`;
		ctx.textAlign = 'center';
		ctx.fillText('error message : ' + this.error.message, canvas.width / 2, canvas.height / 2 + 32);

		ctx.font = '21px zig';
		ctx.fillStyle = `rgba(255,255,255, 1)`;
		ctx.textAlign = 'center';
		ctx.fillText('app will be restarted in ' + timer, canvas.width / 2, canvas.height / 2 + 64);
	}
}

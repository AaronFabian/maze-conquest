import { canvas, ctx, TWEEN, Tween } from '@/global';
import { Panel } from '@/script/gui/Panel';
import { BaseState } from '@/script/state/BaseState';
import { getWrap } from '@/utils';

export class HandleAsyncState extends BaseState {
	pleaseWaitPanel: Panel;
	infoPanel: Panel;
	blink: number = 1;
	info: string[];
	operation: () => Promise<void>;
	onAsyncEnd: () => void;
	constructor({
		info,
		operation,
		onAsyncEnd,
	}: {
		info: string;
		operation: () => Promise<void>;
		onAsyncEnd: () => void;
	}) {
		super();
		this.operation = operation;
		this.onAsyncEnd = onAsyncEnd;
		this.info = getWrap(ctx, info, 400 - 3);

		this.pleaseWaitPanel = new Panel(canvas.width / 2 - 150, canvas.height / 2 - 24, 300, 42);
		this.infoPanel = new Panel(canvas.width / 2 - 200, canvas.height / 2 + 32, 400, 42);

		const tween1 = new Tween(this).to({ blink: 0.2 });
		const tween2 = new Tween(this).to({ blink: 1 });

		tween1.chain(tween2);
		tween2.chain(tween1);

		tween1.start();

		this.run();
	}

	private async run() {
		await this.operation();
		this.onAsyncEnd();
	}

	override render() {
		ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		this.pleaseWaitPanel.render();

		ctx.textAlign = 'center';
		ctx.font = '16px zig';
		ctx.fillStyle = `rgba(255, 255, 255, ${this.blink})`;
		ctx.fillText('Please wait', canvas.width / 2, canvas.height / 2 + 2);

		this.infoPanel.render();

		ctx.textAlign = 'left';
		ctx.fillStyle = 'white';
		this.info.forEach((info, i) => ctx.fillText(info, this.infoPanel.x + 3, this.infoPanel.y + i * 18 + 18));
	}

	override exit = () => TWEEN.removeAll();
}

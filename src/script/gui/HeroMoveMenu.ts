import { CanvasRendering } from '@/script/interface/state/CanvasRendering';
import { Panel } from '@/script/gui/Panel';
import { Hero } from '@/script/object/party/Hero';
import { ctx } from '@/global';
import { keyWasPressed } from '@/index';
import { Item } from '@/script/interface/game/Item';
import { SelectionState } from '@/script/state/game/SelectionState';
import { BattleState } from '@/script/state/game/BattleState';
import { ActionState } from '@/script/state/game/ActionState';

const _window = window as any;

export class HeroMoveMenu implements CanvasRendering {
	x: number;
	y: number;
	width: number;
	height: number;
	panel: Panel;
	hero: Hero;
	cursor: number;
	menu: Item[];
	selectionState: SelectionState;
	constructor(
		selectionState: SelectionState,
		hero: Hero,
		x: number,
		y: number,
		width: number,
		height: number,
		menu: Item[]
	) {
		this.selectionState = selectionState;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.menu = menu;

		this.panel = new Panel(x, y, width, height);
		this.hero = hero;
		this.cursor = 0;
	}

	update() {
		if (keyWasPressed('w')) {
			this.cursor += this.cursor - 1 < 0 ? 3 : -1;
		} else if (keyWasPressed('s')) {
			this.cursor += this.cursor + 1 > 3 ? -3 : 1;
		}

		if (keyWasPressed('Enter')) {
			this.menu[this.cursor].onSelect();

			// Do not proceed to next queue if there is no Hero left in the turn stack
			if (this.selectionState.turnStack.length === 1) {
				console.log('should go to enemy party turn');
				// Remove the SelectionState
				_window.gStateStack.pop();

				_window.gStateStack.push(new ActionState(this.selectionState.battleState));

				this.selectionState.battleInformationState.highLight = null;
			} else {
				this.selectionState.nextQueue();
			}
		}
	}

	render() {
		this.panel.render();
		ctx.font = '14px zig';
		ctx.fillStyle = 'rgba(255, 255, 255, 1)';
		let menuY = this.y + 16;
		for (const item of this.menu) {
			ctx.fillText(item.text, this.x + 24, menuY);
			menuY += 18;
		}

		const cursorImg = _window.gImages.get('cursor');
		ctx.drawImage(cursorImg, this.x + 3, this.y + this.cursor * 18 + 6);
	}
}

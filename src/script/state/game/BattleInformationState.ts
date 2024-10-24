import { canvas, ctx } from '@/global';
import { Panel } from '@/script/gui/Panel';
import { ProgressBar } from '@/script/gui/ProgressBar';
import { Hero } from '@/script/object/party/Hero';
import { BaseState } from '@/script/state/BaseState';
import { BattleState } from '@/script/state/game/BattleState';
import { SelectionState } from '@/script/state/game/SelectionState';

const _window = window as any;

export class BattleInformationState extends BaseState {
	battleState: BattleState;
	panel: Panel;
	finish: boolean;
	highLight: number | null;
	constructor(battleState: BattleState) {
		super();
		this.battleState = battleState;

		this.panel = new Panel(canvas.width / 2 - 360 / 2, canvas.height / 2 - 240 / 2 + 260, 240, 84);
		this.finish = false;
		this.highLight = null;
	}

	override update() {
		this.battleState.update();

		if (this.battleState.firstTurn !== null && this.battleState.secondTurn !== null) {
			if (!this.panel.isAnimating && !this.finish) {
				this.finish = true;
				_window.gStateStack.push(new SelectionState(this));
			}
		} else {
			this.battleState.determineTurn();
			_window.gStateStack.push(new SelectionState(this));
		}
	}

	override render() {
		this.panel.render();

		ctx.font = '14px zig';
		for (let i = 0; i < this.battleState.heroParty.length; i++) {
			const hero = this.battleState.heroParty.party[i] as Hero;
			// This will highlight whose turn
			if (i === this.highLight) ctx.fillStyle = 'rgba(255, 255, 0, 1)';
			else ctx.fillStyle = 'rgba(255, 255, 255, 1)';
			ctx.fillText(
				`${hero.name} HP: ${hero.currentHP}/${hero.HP}`,
				canvas.width / 2 - 180 + 3,
				canvas.height / 2 + 156 + i * 16
			);
		}
	}
}

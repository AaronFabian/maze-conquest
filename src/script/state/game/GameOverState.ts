import { BaseState } from '@/script/state/BaseState';
import { BattleState } from '@/script/state/game/BattleState';

export class GameOverState extends BaseState {
	constructor(public battleState: BattleState) {
		super();
	}

	override update() {
		this.battleState.update();
	}
}

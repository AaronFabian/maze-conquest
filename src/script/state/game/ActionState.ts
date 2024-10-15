import { BaseState } from '@/script/state/BaseState';
import { BattleState } from '@/script/state/game/BattleState';

export class ActionState extends BaseState {
	constructor(public battleState: BattleState) {
		super();
	}

	override update() {
		this.battleState.update();
	}

	override render() {
		console.log('this is action state');
	}
}

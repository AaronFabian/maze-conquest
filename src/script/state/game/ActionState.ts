import { BaseState } from '@/script/state/BaseState';
import { BattleState } from '@/script/state/game/BattleState';

const _window = window as any;

export class ActionState extends BaseState {
	isPerformingAction: boolean;
	constructor(public battleState: BattleState, public actionStack: Array<(s: ActionState) => void>) {
		super();
		this.isPerformingAction = false;
	}

	override update() {
		this.battleState.update();

		if (!this.isPerformingAction) {
			if (this.actionStack.length === 0) {
				// Pop out this stack
				_window.gStateStack.pop();
			} else {
				const onAction = this.actionStack.shift()!;
				onAction(this);
			}
		}
	}
}

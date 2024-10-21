import { BaseState } from '@/script/state/BaseState';
import { BattleState } from '@/script/state/game/BattleState';
import { ExpCalculateState } from '@/script/state/game/ExpCalculateState';
import { GameState } from '@/script/state/game/GameState';
import { SelectionState } from '@/script/state/game/SelectionState';

const _window = window as any;

export class ActionState extends BaseState {
	isPerformingAction: boolean;
	constructor(public battleState: BattleState, public selectEnemyState: SelectionState) {
		super();
		this.isPerformingAction = false;

		// While performing the action, do not highlight any Hero
		this.selectEnemyState.battleInformationState.highLight = null;
	}

	private isPlayerWin() {
		// Before performing action for enemy check is the enemy still alive
		let stopAction = true;
		for (const enemy of this.selectEnemyState.battleState.enemyParty.party)
			if (enemy.isAlive) {
				stopAction = false;
				break;
			}

		if (stopAction) {
			// Filter and retain only GameState and BattleState in the stack
			_window.gStateStack.states = _window.gStateStack.states.filter((s: BaseState) => {
				if (s instanceof GameState || s instanceof BattleState) {
					return true; // Keep GameState or BattleState
				}
				return false; // Remove other states
			});

			// Go to Exp calculation state
			_window.gStateStack.push(
				new ExpCalculateState(this.battleState, this.battleState.enemyParty, this.battleState.heroParty)
			);
		}
	}

	override update() {
		this.battleState.update();

		this.isPlayerWin();

		if (!this.isPerformingAction) {
			if (this.selectEnemyState.moveStack.length === 0) {
				// Pop out this stack and update the enemy attack state
				_window.gStateStack.pop();
			} else {
				const onAction = this.selectEnemyState.moveStack.shift()!;
				onAction(this);
			}
		}
	}
}

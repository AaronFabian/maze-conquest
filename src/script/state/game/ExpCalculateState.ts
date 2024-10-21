import { Enemy } from '@/script/object/party/Enemy';
import { Hero } from '@/script/object/party/Hero';
import { Party } from '@/script/object/party/Party';
import { BaseState } from '@/script/state/BaseState';
import { BattleState } from '@/script/state/game/BattleState';

export class ExpCalculateState extends BaseState {
	constructor(public battleState: BattleState, public enemies: Party, public heroes: Party) {
		super();
	}

	override update() {
		this.battleState.update();
	}
}

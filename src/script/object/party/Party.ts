import { canvas } from '@/global';
import { ENTITY_DEFS } from '@/script/interface/entity/entity_defs';
import { EntityDef } from '@/script/interface/entity/EntityDef';
import { Soldier } from '@/script/object/party/Soldier';
import { EntityBaseState } from '@/script/state/entity/EntityBaseState';
import { SoldierBaseState } from '@/script/state/entity/party/soldier/SoldierBaseState';
import { SoldierIdleState } from '@/script/state/entity/party/soldier/SoldierIdleState';
import { StateMachine } from '@/script/state/StateMachine';
import { Level } from '@/script/world/Level';
import { Entity } from '@/script/object/entity/Entity';

export class Party {
	level: Level;
	party: Entity[];
	finishTurn: boolean;
	order: number;

	constructor(level: Level, party: Entity[]) {
		this.level = level;
		this.party = party;
		this.finishTurn = false;
		this.order = 0;
	}

	update() {
		// Only get the current turn
		const member = this.party[this.order];
		member.update();
	}

	render() {
		for (const member of this.party) {
			member.render();
		}
	}
}

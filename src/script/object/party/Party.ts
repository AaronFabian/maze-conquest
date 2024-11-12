import { Entity } from '@/script/object/entity/Entity';
import { Level } from '@/script/world/Level';

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

	get length(): number {
		return this.party.length;
	}

	findHeroIndex(reference: Entity): number {
		return this.party.indexOf(reference);
	}

	update() {
		for (const member of this.party) {
			member.currentAnimation!.update();
		}
	}

	render() {
		for (const member of this.party) {
			member.render();

			// debugging-purpose
			// ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
			// ctx.fillRect(member.x, member.y, member.width, member.height);
		}
	}
}

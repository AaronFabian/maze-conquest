import { canvas, ctx, Tween } from '@/global';
import { ENTITY_DEFS } from '@/script/interface/entity/entity_defs';
import { EntityDef } from '@/script/interface/entity/EntityDef';
import { Entity } from '@/script/object/entity/Entity';
import { Party } from '@/script/object/party/Party';
import { Soldier } from '@/script/object/party/Soldier';
import { BaseState } from '@/script/state/BaseState';
import { EntityBaseState } from '@/script/state/entity/EntityBaseState';
import { SoldierBaseState } from '@/script/state/entity/party/soldier/SoldierBaseState';
import { SoldierIdleState } from '@/script/state/entity/party/soldier/SoldierIdleState';
import { StateMachine } from '@/script/state/StateMachine';
import { Level } from '@/script/world/Level';
import { BattleNatatorState } from '@/script/state/game/BattleNatatorState';

const _window = window as any;

export class BattleState extends BaseState {
	level: Level;
	finishOpening: boolean;
	heroParty: Party;
	enemyParty: Party;

	constructor(level: Level) {
		super();

		this.level = level;
		this.finishOpening = false;

		// Hero party
		const heroes: Entity[] = [];
		const soldierDef: EntityDef = ENTITY_DEFS.soldier;
		const soldier = new Soldier(soldierDef);

		const soldierState = new Map<string, () => EntityBaseState>();
		soldierState.set('idle', () => new SoldierIdleState(soldier));
		soldierState.set('run', () => new SoldierBaseState(soldier));

		soldier.setStateMachine = new StateMachine(soldierState);
		soldier.changeState('run');

		// Make our party at the outside of the battle field
		soldier.x = canvas.width / 2 + 320;
		soldier.y = canvas.height / 2 - 240 / 2 + 32;
		heroes.push(soldier);

		this.heroParty = new Party(this.level, heroes);

		// Opponent Party
		const enemies: Entity[] = [];
		this.enemyParty = new Party(this.level, enemies);

		// Here where the hero begin to transition in
		this.heroSlideIn();
	}

	heroSlideIn() {
		for (let i = 0; i < this.heroParty.party.length; i++) {
			const member = this.heroParty.party[i];
			const startAnimate = () => {
				new Tween(member)
					.to({ x: canvas.width / 2 + 64 })
					.onComplete(() => {
						// Immediate stop the CurtainOpenState
						// _window.gStateStack.pop();
						member.changeState('idle');
					})
					.start();
			};

			// Wait the CurtainOpen animation finished for 500ms
			setTimeout(startAnimate, 600 + 100 * i);
		}
	}

	override update() {
		this.heroParty.update();
	}

	override render() {
		ctx.save();

		// First, fill the entire canvas with black for the background
		ctx.fillStyle = 'rgba(0, 0, 0, 1)';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// Now, define and apply the clipping area
		ctx.beginPath();
		ctx.rect(canvas.width / 2 - 320 / 2, canvas.height / 2 - 240 / 2, 320, 240);
		ctx.clip();

		// Draw the battlefield image (which will be clipped)
		ctx.drawImage(_window.gImages.get('level1-battlefield'), canvas.width / 2 - 320 / 2, canvas.height / 2 - 240 / 2);

		// Draw other elements within the clipped area
		this.heroParty.render();
		this.enemyParty.render();

		ctx.restore();
	}
}

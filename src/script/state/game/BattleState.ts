import { canvas, ctx, Tween } from '@/global';
import { ENTITY_DEFS } from '@/script/interface/entity/entity_defs';
import { EntityDef } from '@/script/interface/entity/EntityDef';
import { Entity } from '@/script/object/entity/Entity';
import { Party } from '@/script/object/party/Party';
import { Hero } from '@/script/object/party/Hero';
import { BaseState } from '@/script/state/BaseState';
import { EntityBaseState } from '@/script/state/entity/EntityBaseState';
import { HeroBaseState } from '@/script/state/entity/party/HeroBaseState';
import { HeroIdleState } from '@/script/state/entity/party/HeroIdleState';
import { StateMachine } from '@/script/state/StateMachine';
import { Level } from '@/script/world/Level';
import { BattleNatatorState } from '@/script/state/game/BattleNatatorState';
import { HeroDef } from '@/script/interface/entity/HeroDef';
import { HERO_DEFS } from '@/script/interface/entity/hero_defs';
import { EnemyDef } from '@/script/interface/entity/EnemyDef';
import { ENEMY_DEFS } from '@/script/interface/entity/enemy_defs';

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
		this.heroParty = this.generateHeroParty();

		// Opponent Party
		this.enemyParty = this.generateEnemyParty();

		// Here where the hero begin to transition in
		this.slideIn();
	}
	generateEnemyParty(): Party {
		const enemies: Entity[] = [];
		const orcDef: EnemyDef = ENEMY_DEFS.orc;
		const orc = new Hero(orcDef, 1);

		const orcState = new Map<string, () => EntityBaseState>();
		orcState.set('idle', () => new HeroIdleState(orc));
		orcState.set('run', () => new HeroBaseState(orc));

		orc.setStateMachine = new StateMachine(orcState);
		orc.setDirection = 'right';
		orc.changeState('run');

		// Make our party at the outside of the battle field
		orc.x = canvas.width / 2 - 320;
		orc.y = canvas.height / 2 - 240 / 2 + 64;
		enemies.push(orc);

		return new Party(this.level, enemies);
	}

	private generateHeroParty(): Party {
		const heroes: Entity[] = [];
		const soldierDef: HeroDef = HERO_DEFS.soldier;
		const soldier = new Hero(soldierDef, 1);

		const soldierState = new Map<string, () => EntityBaseState>();
		soldierState.set('idle', () => new HeroIdleState(soldier));
		soldierState.set('run', () => new HeroBaseState(soldier));

		soldier.setStateMachine = new StateMachine(soldierState);
		soldier.setDirection = 'left';
		soldier.changeState('run');

		// Make our party at the outside of the battle field
		soldier.x = canvas.width / 2 + 320;
		soldier.y = canvas.height / 2 - 240 / 2 + 64;
		heroes.push(soldier);

		return new Party(this.level, heroes);
	}

	private slideIn() {
		for (let i = 0; i < this.heroParty.party.length; i++) {
			const enemy = this.enemyParty.party[i];
			const startAnimate = () => {
				new Tween(enemy)
					.to({ x: canvas.width / 2 - 96 })
					.onComplete(() => {
						enemy.changeState('idle');
					})
					.start();
			};

			setTimeout(startAnimate, 500 + 100 * i);
		}

		for (let i = 0; i < this.heroParty.party.length; i++) {
			const member = this.heroParty.party[i];
			const startAnimate = () => {
				new Tween(member)
					.to({ x: canvas.width / 2 + 96 })
					.onComplete(() => {
						member.changeState('idle');

						if (i === this.heroParty.party.length - 1) {
							// Immediate stop the CurtainOpenState
							// _window.gStateStack.pop();

							let text = 'You are encountering \n';
							for (const enemy of this.enemyParty.party) {
								text += (enemy as Hero).name;
							}

							_window.gStateStack.push(new BattleNatatorState(this, text, () => console.log('ok')));
						}
					})
					.start();
			};

			// Wait the CurtainOpen animation finished for 500ms
			setTimeout(startAnimate, 500 + 100 * i);
		}
	}

	override update() {
		this.heroParty.update();
		this.enemyParty.update();
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

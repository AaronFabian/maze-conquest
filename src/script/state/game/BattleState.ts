import { canvas, ctx, Tween } from '@/global';
import { ENEMY_DEFS } from '@/script/interface/entity/enemy_defs';
import { EnemyDef } from '@/script/interface/entity/EnemyDef';
import { HERO_DEFS } from '@/script/interface/entity/hero_defs';
import { HeroDef } from '@/script/interface/entity/HeroDef';
import { Entity } from '@/script/object/entity/Entity';
import { Enemy } from '@/script/object/party/Enemy';
import { Hero } from '@/script/object/party/Hero';
import { Party } from '@/script/object/party/Party';
import { BaseState } from '@/script/state/BaseState';
import { EntityBaseState } from '@/script/state/entity/EntityBaseState';
import { EntityIdleState } from '@/script/state/entity/EntityIdleState';
import { EntityRunState } from '@/script/state/entity/EntityRunState';
import { HeroAttackState } from '@/script/state/entity/party/HeroAttackState';
import { HeroBaseState } from '@/script/state/entity/party/HeroBaseState';
import { HeroIdleState } from '@/script/state/entity/party/HeroIdleState';
import { BattleInformationState } from '@/script/state/game/BattleInformationState';
import { BattleNatatorState } from '@/script/state/game/BattleNatatorState';
import { StateMachine } from '@/script/state/StateMachine';
import { Level } from '@/script/world/Level';

const _window = window as any;

export class BattleState extends BaseState {
	level: Level;
	finishOpening: boolean;
	heroParty: Party;
	enemyParty: Party;
	battleStarted: boolean;
	firstTurn: Party | null;
	secondTurn: Party | null;

	constructor(level: Level) {
		super();

		this.level = level;
		this.finishOpening = false;
		this.battleStarted = false;
		this.firstTurn = null;
		this.secondTurn = null;

		// Hero party
		this.heroParty = this.generateHeroParty();

		// Opponent Party
		this.enemyParty = this.generateEnemyParty();
	}
	private generateEnemyParty(): Party {
		const enemies: Entity[] = [];
		const orcDef: EnemyDef = ENEMY_DEFS.orc;
		const orc = new Enemy(orcDef, 1);

		const orcState = new Map<string, () => EntityBaseState>();
		orcState.set('idle', () => new EntityIdleState(orc));
		orcState.set('run', () => new EntityRunState(orc));

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
		soldierState.set('attack', () => new HeroAttackState(soldier));

		soldier.setStateMachine = new StateMachine(soldierState);
		soldier.setDirection = 'left';
		soldier.changeState('idle');

		// Make our party at the outside of the battle field
		soldier.x = canvas.width / 2 + 320;
		soldier.y = canvas.height / 2 - 240 / 2 + 64;
		heroes.push(soldier);

		return new Party(this.level, heroes);
	}

	private triggerSlideIn() {
		this.battleStarted = true;

		for (let i = 0; i < this.enemyParty.length; i++) {
			const enemy = this.enemyParty.party[i];
			const enemySlideInAnimate = () => {
				new Tween(enemy)
					.to({ x: canvas.width / 2 - 96 })
					.onComplete(() => {
						enemy.changeState('idle');
					})
					.start();
			};

			setTimeout(enemySlideInAnimate, 500 + 100 * i);
		}

		for (let i = 0; i < this.heroParty.length; i++) {
			const member = this.heroParty.party[i];
			const heroSlideInAnimate = () => {
				new Tween(member)
					.to({ x: canvas.width / 2 + 96 })
					.onComplete(() => {
						member.changeState('idle');

						if (i === this.heroParty.party.length - 1) {
							// Immediate stop the CurtainOpenState
							// _window.gStateStack.pop();

							let text = 'You are encountering \n';
							for (let i = 0; i < this.enemyParty.party.length; i++) {
								const enemy = this.enemyParty.party[0] as Enemy;
								text += enemy.name + (i === this.enemyParty.party.length - 1 ? '' : ', ');
							}

							// here will be trigger BattleNatatorState
							// When Natator finish speaking then determine which turn should go first
							_window.gStateStack.push(
								new BattleNatatorState(this, text, () => {
									// For the first time we need to determine which one is going first
									this.determineTurn();

									_window.gStateStack.push(new BattleInformationState(this));
								})
							);
						}
					})
					.start();
			};

			// Wait the CurtainOpen animation finished for 500ms
			setTimeout(heroSlideInAnimate, 500 + 100 * i);
		}
	}

	private determineTurn() {
		let heroesSpeed = 0;
		for (let i = 0; i < this.heroParty.length; i++) {
			const hero = this.heroParty.party[i] as Hero;
			heroesSpeed += hero.speed;
		}

		let enemiesSpeed = 0;
		for (let i = 0; i < this.enemyParty.length; i++) {
			const enemy = this.enemyParty.party[i] as Enemy;
			enemiesSpeed += enemy.speed;
		}

		if (heroesSpeed >= enemiesSpeed) {
			this.firstTurn = this.heroParty;
			this.secondTurn = this.enemyParty;
		} else {
			this.firstTurn = this.enemyParty;
			this.secondTurn = this.heroParty;
		}
	}

	override update() {
		this.heroParty.update();
		this.enemyParty.update();

		// Here where the hero begin to transition in
		if (!this.battleStarted) {
			this.triggerSlideIn();
		}
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

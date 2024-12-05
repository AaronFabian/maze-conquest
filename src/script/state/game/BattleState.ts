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
import { EntityAttackState } from '@/script/state/entity/EntityAttackState';
import { EntityBaseState } from '@/script/state/entity/EntityBaseState';
import { EntityIdleState } from '@/script/state/entity/EntityIdleState';
import { EntityRunState } from '@/script/state/entity/EntityRunState';
import { HeroAttackState } from '@/script/state/entity/party/HeroAttackState';
import { HeroBaseState } from '@/script/state/entity/party/HeroBaseState';
import { HeroIdleState } from '@/script/state/entity/party/HeroIdleState';
import { BattleInformationState } from '@/script/state/game/BattleInformationState';
import { BattleNatatorState } from '@/script/state/game/BattleNatatorState';
import { StateMachine } from '@/script/state/StateMachine';
import { User } from '@/script/system/model/User';
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
	user: User;

	constructor(level: Level) {
		super();

		this.level = level;
		this.user = this.level.world.user;
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

		// orc
		const orcDef: EnemyDef = ENEMY_DEFS.orc;
		const orc = new Enemy(orcDef, 1);

		const orcState = new Map<string, () => EntityBaseState>();
		orcState.set('idle', () => new EntityIdleState(orc));
		orcState.set('run', () => new EntityRunState(orc));
		orcState.set('attack', () => new EntityAttackState(orc));

		orc.setStateMachine = new StateMachine(orcState);
		orc.setDirection = 'right';
		orc.changeState('run');

		// Make our party at the outside of the battle field
		orc.x = canvas.width / 2 - 320;
		orc.y = canvas.height / 2 - 240 / 2 + 64;
		enemies.push(orc);

		// skeleton
		const skeletonDef: EnemyDef = ENEMY_DEFS.skeleton;
		const skeleton = new Enemy(skeletonDef, 1);

		const skeletonState = new Map<string, () => EntityBaseState>();
		skeletonState.set('idle', () => new EntityIdleState(skeleton));
		skeletonState.set('run', () => new EntityRunState(skeleton));
		skeletonState.set('attack', () => new EntityAttackState(skeleton));

		skeleton.setStateMachine = new StateMachine(skeletonState);
		skeleton.setDirection = 'right';
		skeleton.changeState('run');

		// Make our party at the outside of the battle field
		skeleton.x = canvas.width / 2 - 320;
		skeleton.y = canvas.height / 2 - 240 / 2 + 112;
		enemies.push(skeleton);

		return new Party(this.level, enemies);
	}

	private generateHeroParty(): Party {
		const heroes: Entity[] = [];

		/*
		// soldier
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

		// wizard
		const wizardDef: HeroDef = HERO_DEFS.wizard;
		const wizard = new Hero(wizardDef, 2);

		const wizardState = new Map<string, () => EntityBaseState>();
		wizardState.set('idle', () => new HeroIdleState(wizard));
		wizardState.set('run', () => new HeroBaseState(wizard));
		wizardState.set('attack', () => new HeroAttackState(wizard));

		wizard.setStateMachine = new StateMachine(wizardState);
		wizard.setDirection = 'left';
		wizard.changeState('idle');

		wizard.x = canvas.width / 2 + 320;
		wizard.y = canvas.height / 2 - 240 / 2 + 112;
		heroes.push(wizard);
		*/

		const userAllHeroes = this.user.getAllHeroes;
		const userParty = this.user.getParty;
		for (let i = 0; i < userParty.length; i++) {
			const heroName = userParty[i];
			const hero = userAllHeroes.get(heroName)!;
			if (hero === undefined) throw new Error('Unexpected behavior while starting battle at BattleState');

			hero.x = canvas.width / 2 + 320;
			hero.y = canvas.height / 2 - 240 / 2 + 64 * (i + 1);
			// TODO: Fix = If the hero dead. they still can be stand

			heroes.push(hero);
		}

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
							// Creating text for battle opening
							let text = 'You are encountering ';
							for (let j = 0; j < this.enemyParty.party.length; j++) {
								const enemy = this.enemyParty.party[j] as Enemy;
								text += enemy.name + (j === this.enemyParty.party.length - 1 ? '' : ', ');
							}

							// here will be trigger BattleNatatorState
							// When Natator finish speaking then determine which turn should go first
							_window.gStateStack.push(
								new BattleNatatorState(this, text, () => {
									// For the first time we need to determine which one is going first
									this.determineTurn();

									// The information about Player Party will always shown
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

	determineTurn() {
		let heroesSpeed = 0;
		for (let i = 0; i < this.heroParty.length; i++) {
			const hero = this.heroParty.party[i] as Hero;
			if (!hero.isAlive) continue;
			heroesSpeed += hero.speed;
		}

		let enemiesSpeed = 0;
		for (let i = 0; i < this.enemyParty.length; i++) {
			const enemy = this.enemyParty.party[i] as Enemy;
			if (!enemy.isAlive) continue;
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

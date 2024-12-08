import { Enemy } from '@/script/object/party/Enemy';
import { Hero } from '@/script/object/party/Hero';
import { BaseState } from '@/script/state/BaseState';
import { BattleState } from '@/script/state/game/BattleState';
import { GameOverState } from '@/script/state/game/GameOverState';
import { GameState } from '@/script/state/game/GameState';
import { SystemError } from '@/script/system/error/SystemError';

const _window = window as any;

export class EnemyActionState extends BaseState {
	isPerformingAction: boolean;
	battleState: BattleState;
	enemyTurnStack: Enemy[];
	enemyMoveStack: ((s: EnemyActionState) => void)[];
	constructor(battleState: BattleState) {
		super();

		this.battleState = battleState;
		this.isPerformingAction = false;

		this.enemyTurnStack = this.determineEnemyTurnStack();

		this.enemyMoveStack = this.AIMove();
	}

	private AIMove(): Array<(state: EnemyActionState) => void> {
		const moveStack = [];

		// Sort heroes by slowest speed and lowest defense
		const heroesSortedBySpeedAndDefense = this.battleState.heroParty.party
			.filter(hero => hero.isAlive) // Filter only alive heroes
			.sort((a, b) => {
				const heroA = a as Hero;
				const heroB = b as Hero;
				const heroAScore = heroA.speed + heroA.defense;
				const heroBScore = heroB.speed + heroB.defense;
				return heroBScore - heroAScore; // Sort from slowest and least defense
			});

		// Loop through each enemy's turn and select a target hero
		for (const enemy of this.enemyTurnStack) {
			// Select the first available (alive) hero
			const targetHero = heroesSortedBySpeedAndDefense.find(hero => hero.isAlive);

			// Ensure a valid hero is selected
			if (!targetHero) {
				throw new SystemError('No valid hero found for AI move');
			}

			// Add the attack move to the move stack
			moveStack.push(enemy.moveSet['attack'](enemy, targetHero as Hero));
		}

		return moveStack;
	}

	private determineEnemyTurnStack(): Enemy[] {
		const turnStack = [];
		for (let i = 0; i < this.battleState.enemyParty.length; i++) {
			const enemy = this.battleState.enemyParty.party[i] as Enemy;
			if (!enemy.isAlive) continue;

			// If no enemy yet in the stack
			if (turnStack.length === 0) {
				turnStack.push(enemy);
				continue;
			}

			// Push the new enemy to turnStack and then sort by DESC by their speed
			turnStack.push(enemy);
			turnStack.sort((prevEnemy, currentEnemy) => currentEnemy.speed - prevEnemy.speed);
		}

		return turnStack;
	}

	private isEnemyWin() {
		// Check does the Player Party still alive or not. If not then that means the Player lose
		let isPlayerLose = true;
		for (const hero of this.battleState.heroParty.party)
			if (hero.isAlive) {
				isPlayerLose = false;
				break;
			}

		if (isPlayerLose) {
			// Filter and retain only GameState and BattleState in the stack
			_window.gStateStack.states = _window.gStateStack.states.filter((s: BaseState) => {
				if (s instanceof GameState || s instanceof BattleState) {
					return true; // Keep GameState or BattleState
				}
				return false; // Remove other states
			});

			// Go to Exp calculation state
			_window.gStateStack.push(new GameOverState(this.battleState));
			// new GameOverState(this.battleState, this.battleState.enemyParty, this.battleState.heroParty)
		}
	}

	override update() {
		this.battleState.update();

		this.isEnemyWin();

		if (!this.isPerformingAction) {
			if (this.enemyMoveStack.length === 0) {
				// Pop out this stack and update the ActionState
				_window.gStateStack.pop();
			} else {
				const onAction = this.enemyMoveStack.shift()!;
				onAction(this);
			}
		}
	}
}

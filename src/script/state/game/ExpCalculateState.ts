import { canvas, ctx, TWEEN, Tween } from '@/global';
import { keyWasPressed } from '@/index';
import { Panel } from '@/script/gui/Panel';
import { ProgressBar } from '@/script/gui/ProgressBar';
import { Enemy } from '@/script/object/party/Enemy';
import { Hero } from '@/script/object/party/Hero';
import { Party } from '@/script/object/party/Party';
import { BaseState } from '@/script/state/BaseState';
import { BattleState } from '@/script/state/game/BattleState';
import { FadeInState } from '@/script/state/game/FadeInState';
import { FadeOutState } from '@/script/state/game/FadeOutState';

const _window = window as any;

export class ExpCalculateState extends BaseState {
	panel: Panel;
	totalEnemyDefeated: Map<string, [number, number, number]>;
	secondPress: boolean;
	progressBars: ProgressBar[];
	totalGetExp: number;
	heroLevel: number[];
	counter: number;
	constructor(public battleState: BattleState, public enemies: Party, public heroes: Party) {
		super();

		// 01 The down panel will render the summary of the battle
		this.panel = new Panel(canvas.width / 2 - 360 / 2, canvas.height / 2 - 240 / 2 + 260, 360, 84);
		this.totalEnemyDefeated = new Map();
		this.totalGetExp = 0;
		for (let i = 0; i < this.enemies.length; i++) {
			const enemy = this.enemies.party[i] as Enemy;
			if (this.totalEnemyDefeated.has(enemy.name)) {
				const [totalDefeated, individualExp, totalExp] = this.totalEnemyDefeated.get(enemy.name)!;
				this.totalEnemyDefeated.set(enemy.name, [totalDefeated + 1, individualExp, totalExp + enemy.exp]);
				this.totalGetExp += enemy.exp;
			} else {
				this.totalEnemyDefeated.set(enemy.name, [1, enemy.exp, enemy.exp]);
				this.totalGetExp += enemy.exp;
			}
		}

		// 02 Create flag if the Player already press Enter again (will automatically pressed at several seconds)
		this.secondPress = false;

		// 03 Floating black panel will render each Hero to the next level;
		this.progressBars = [];
		this.heroLevel = []; // This is fake Hero level reference; for visually purpose
		for (let i = 0; i < this.heroes.party.length; i++) {
			const hero = this.heroes.party[i] as Hero;
			this.progressBars.push(
				new ProgressBar({
					x: canvas.width / 2 - 94 + 3,
					y: canvas.height / 2 - 84 + 32 * (i + 1),
					color: { r: 189, g: 32, b: 32 },
					width: 170,
					height: 6,
					value: hero.currentExp,
					max: hero.expToLevel,
				})
			);

			// Here get the current hero fake reference at this index for visually effect
			this.heroLevel.push(hero.level);
		}

		this.counter = 0;
	}

	override enter(_: any) {
		// Make the Hero sprite at victory state
		this.heroes.party.forEach(hero => (hero.isAlive ? (hero.setAnimation = 'victory-left') : null));
	}

	private tweenHeroExpProgressBar() {
		// Start to Tween / Tweening chaining animation for exp ProgressBar
		// Iterate through each hero's progress bar to animate experience gain
		for (let i = 0; i < this.progressBars.length; i++) {
			const progressBar = this.progressBars[i];
			const hero = this.heroes.party[i] as Hero;

			// Cut the total exp, so If ProgressBar exceed / Hero level Up the left exp
			let remainingExp = this.totalGetExp;
			let tweenFirstRef = null;
			let tweenRef = null;

			// Loop until all experience is allocated
			while (remainingExp > 0) {
				// 01 Get the difference
				const expForNextLevel = hero.expToLevel - hero.currentExp;

				if (expForNextLevel - remainingExp > 0) {
					// 02 Tween the current state
					// This block add experience without level up
					const ref = new Tween(progressBar).to({ value: progressBar.value + remainingExp }, 750);
					hero.currentExp += remainingExp;

					// 03 Check for reference
					if (tweenFirstRef === null) tweenFirstRef = ref;
					else tweenRef!.chain(ref);

					// break;
					remainingExp -= expForNextLevel;
				} else {
					// 02 Create tween reference before player go to next level
					const ref = new Tween(progressBar).to({ value: hero.expToLevel }, 750);

					// 03 Subtract the reward exp
					remainingExp -= expForNextLevel;

					// 04 If everything is setup then level up the Hero
					hero.levelUP();

					// 05 Use the tween reference for restart status, Make sure we get enough data from real Hero data
					const newExpToLevel = hero.expToLevel;
					ref.onComplete(() => {
						progressBar.setValue = 0;
						progressBar.setMax = newExpToLevel;

						// Get this progress bar fake level and lvl up!, so it feels like the Hero Lvl Up visually
						this.heroLevel[i]++;
					});

					// 06 Check for reference, chain if needed
					if (tweenFirstRef === null) {
						tweenFirstRef = ref;
						tweenRef = ref;
					} else {
						tweenRef!.chain(ref);
						tweenRef = ref;
					}
				}
			}

			// Start the progress bar animation
			tweenFirstRef.start();
		}
	}

	override update() {
		this.battleState.update();
		// this.panel.update();

		if (keyWasPressed('Enter')) {
			this.counter++;
		}

		switch (this.counter) {
			case 1:
				this.secondPress = true;
				this.tweenHeroExpProgressBar();
				this.counter++;
				break;

			case 3:
				_window.gStateStack.push(
					new FadeInState({ r: 255, g: 255, b: 255 }, 1000, () => {
						// Will pop this state
						_window.gStateStack.pop();

						// Will pop the battle state
						_window.gStateStack.pop();

						_window.gStateStack.push(new FadeOutState({ r: 255, g: 255, b: 255 }, 1000, () => {}));

						// Just for reminder that, the logic where why BattleState trigger gone is because
						// the logic at Path.ts that change that Path MazeObjectType into normal Path
					})
				);
				this.counter++;
				break;

			default:
				// ---
				break;
		}
	}

	override render() {
		this.panel.render();

		if (this.secondPress) {
			// Related to panel
			ctx.font = '14px zig';
			ctx.fillStyle = 'rgba(255, 255, 255, 1)';
			ctx.fillText(`Total exp ${this.totalGetExp}`, canvas.width / 2 - 180 + 3, canvas.height / 2 - 240 / 2 + 278);

			// Floating modal
			ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
			ctx.fillRect(canvas.width / 2 - 94, canvas.height / 2 - 86, 177, 32 * this.heroes.length + 32);
			for (let i = 0; i < this.heroes.length; i++) {
				const hero = this.heroes.party[i] as Hero;
				const progressBar = this.progressBars[i];
				progressBar.render();

				ctx.font = '14px zig';
				ctx.fillStyle = 'rgba(255, 255, 255, 1)';
				ctx.fillText(hero.name, progressBar.x, progressBar.y - 10);

				// Get the fake level reference
				const lvl = this.heroLevel[i];
				ctx.fillText('Lv.' + lvl.toString(), progressBar.x + 114, progressBar.y - 10);
			}
		}

		if (!this.secondPress) {
			// Related to panel
			ctx.font = '14px zig';
			ctx.fillStyle = 'rgba(255, 255, 255, 1)';
			ctx.fillText('You win !', canvas.width / 2 - 180 + 3, canvas.height / 2 - 240 / 2 + 278);
			let counter = 1;
			for (const [key, [totalDefeated, individualExp, totalExp]] of this.totalEnemyDefeated.entries()) {
				const text = `${key}: ${totalDefeated} x ${individualExp} : ${totalExp} EXP`;
				ctx.fillText(text, canvas.width / 2 - 180 + 3, canvas.height / 2 - 398 + 16 * counter);
				counter++;
			}
		}
	}

	override exit = () => TWEEN.removeAll();
}

import { canvas, ctx, Tween } from '@/global';
import { keyWasPressed } from '@/index';
import { Panel } from '@/script/gui/Panel';
import { ProgressBar } from '@/script/gui/ProgressBar';
import { Enemy } from '@/script/object/party/Enemy';
import { Hero } from '@/script/object/party/Hero';
import { Party } from '@/script/object/party/Party';
import { BaseState } from '@/script/state/BaseState';
import { BattleState } from '@/script/state/game/BattleState';

export class ExpCalculateState extends BaseState {
	panel: Panel;
	totalEnemyDefeated: Map<string, [number, number, number]>;
	secondPress: boolean;
	progressBars: ProgressBar[];
	totalGetExp: number;
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
		for (let i = 0; i < this.heroes.party.length; i++) {
			const hero = this.heroes.party[i] as Hero;
			this.progressBars.push(
				new ProgressBar({
					x: canvas.width / 2 - 84 + 3,
					y: canvas.height / 2 - 84 + 32 * (i + 1),
					color: { r: 189, g: 32, b: 32 },
					width: 160,
					height: 6,
					value: hero.currentExp,
					max: hero.expToLevel,
				})
			);
		}
	}

	override enter(_: any) {
		// Make the Hero sprite at victory state
		this.heroes.party.forEach(hero => (hero.isAlive ? (hero.setAnimation = 'victory-left') : null));
	}

	override update() {
		this.battleState.update();
		this.panel.render();

		if (keyWasPressed('Enter')) {
			if (!this.secondPress) {
				this.secondPress = true;
				// Start to Tween the exp ProgressBar
				for (let i = 0; i < this.progressBars.length; i++) {
					const progressBar = this.progressBars[i];
					new Tween(progressBar)
						.to({ value: progressBar.value + 7000 }, 1500)
						// .to({ value: progressBar.value + this.totalGetExp })
						.onComplete()
						.start();
				}
				console.log('ok');
			}
		}
	}

	override render() {
		this.panel.render();

		ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
		ctx.fillRect(canvas.width / 2 - 84, canvas.height / 2 - 86, 167, 32 * this.heroes.length + 32);
		for (let i = 0; i < this.heroes.length; i++) {
			const hero = this.heroes.party[i] as Hero;
			const progressBar = this.progressBars[i];
			ctx.font = '14px zig';
			ctx.fillStyle = 'rgba(255, 255, 255, 1)';
			ctx.fillText(hero.name, progressBar.x, progressBar.y - 10);
			progressBar.render();
		}

		ctx.font = '14px zig';
		ctx.fillStyle = 'rgba(255, 255, 255, 1)';
		ctx.fillText('You win !', canvas.width / 2 - 180 + 3, canvas.height / 2 - 240 / 2 + 278);
		let counter = 1;
		for (const [key, [totalDefeated, individualExp, totalExp]] of this.totalEnemyDefeated.entries()) {
			const text = `${key}: ${totalDefeated} x ${individualExp} : ${totalExp} EXP`;
			ctx.fillText(text, canvas.width / 2 - 180 + 3, canvas.height / 2 - 240 / 2 + 278 + 16 * counter);
			counter++;
		}
	}
}

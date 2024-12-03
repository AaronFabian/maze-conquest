import { ctx } from '@/global';
import { keyWasPressed } from '@/index';
import { Hero } from '@/script/object/party/Hero';
import { BaseState } from '@/script/state/BaseState';
import { FadeInState } from '@/script/state/game/FadeInState';
import { FadeOutState } from '@/script/state/game/FadeOutState';
import { StartState } from '@/script/state/game/StartState';
import { User } from '@/script/system/model/User';

const _window = window as any;

enum LocalScreen {
	Menu,
	Party,
	ExitConfirmation,
}

export class PauseMenuState extends BaseState {
	private user: User;
	cursor: number;
	localScreen: LocalScreen;
	constructor(user: User) {
		super();
		this.user = user;

		this.localScreen = LocalScreen.Menu;
		this.cursor = 1;
	}

	override update() {
		if (keyWasPressed('Enter')) {
			switch (this.localScreen) {
				case LocalScreen.Menu:
					// <- !close this state
					if (this.cursor === 1) {
						_window.gStateStack.pop();
					}

					// Menu -> Party
					if (this.cursor === 2) {
						this.cursor = 1;
						this.localScreen = LocalScreen.Party;
					}

					if (this.cursor === 5) {
						this.cursor = 1;
						this.localScreen = LocalScreen.ExitConfirmation;
					}
					break;

				case LocalScreen.Party:
					if (this.cursor === this.user.getParty.length + 1) {
						this.cursor = 1;
						this.localScreen = LocalScreen.Menu;
					}
					break;

				case LocalScreen.ExitConfirmation:
					// yes: <- !quit game
					if (this.cursor === 1) {
						_window.gStateStack.push(
							new FadeInState({ r: 255, g: 255, b: 255 }, 1000, () => {
								_window.gStateStack.pop(); // PauseMenuState

								_window.gStateStack.push(new StartState());

								_window.gStateStack.push(
									new FadeOutState({ r: 255, g: 255, b: 255 }, 1000, () => {
										// Do nothing...
									})
								);
							})
						);
					}

					// no: <- Menu
					if (this.cursor === 2) {
						this.cursor = 1;
						this.localScreen = LocalScreen.Menu;
					}
					break;

				default:
					throw new Error('Unexpected behavior while changing LocalScreen at Pause Menu');
			}
		}

		let maxOptions = 6;
		if (this.localScreen === LocalScreen.Party) {
			maxOptions = this.user.getParty.length + 1;
		}
		if (this.localScreen === LocalScreen.ExitConfirmation) {
			maxOptions = 2;
		}

		if (keyWasPressed('w')) {
			this.cursor = this.cursor - 1 < 1 ? maxOptions : this.cursor - 1;
		} else if (keyWasPressed('s')) {
			this.cursor = this.cursor + 1 > maxOptions ? 1 : this.cursor + 1;
		}
	}

	override render() {
		ctx.fillStyle = 'rgba(0, 0, 200, 0.8)';
		ctx.fillRect(0, 0, 500, 125);

		switch (this.localScreen) {
			case LocalScreen.Menu:
				ctx.font = '16px zig';
				ctx.textAlign = 'start';
				ctx.fillStyle = `rgba(255, 255, 255, ${this.cursor === 1 ? 1 : 0.4})`;
				ctx.fillText('Continue', 6, 16);
				ctx.fillStyle = `rgba(255, 255, 255, ${this.cursor === 2 ? 1 : 0.4})`;
				ctx.fillText('Party', 6, 34);
				ctx.fillStyle = `rgba(255, 255, 255, ${this.cursor === 3 ? 1 : 0.4})`;
				ctx.fillText('Heroes', 6, 52);
				ctx.fillStyle = `rgba(255, 255, 255, ${this.cursor === 4 ? 1 : 0.4})`;
				ctx.fillText('Inventory', 6, 68);
				ctx.fillStyle = `rgba(255, 255, 255, ${this.cursor === 5 ? 1 : 0.4})`;
				ctx.fillText('Exit', 6, 84);
				ctx.fillStyle = `rgba(255, 255, 255, ${this.cursor === 6 ? 1 : 0.4})`;
				ctx.fillText('Exit', 6, 96);
				break;

			case LocalScreen.Party:
				ctx.font = '16px zig';
				ctx.fillStyle = `rgba(255, 255, 255, 1)`;
				ctx.fillText('Party member', 6, 16);

				const userParty: string[] = this.user.getParty;
				const userAllHeroes: Map<string, Hero> = this.user.getAllHeroes;
				for (let i = 1; i <= userParty.length; i++) {
					ctx.fillStyle = `rgba(255, 255, 255, ${this.cursor === i ? 1 : 0.4})`;
					const memberName = userParty[i - 1];
					const hero = userAllHeroes.get(memberName)!;
					const heroInfo = `${this.cursor === i ? '> ' : '  '}${memberName} - Lv.${hero.level} - ${hero.currentHP}/${
						hero.HP
					}`;
					ctx.fillText(heroInfo, 16, 16 * (i + 1) + 2);
				}

				ctx.fillStyle = `rgba(255, 255, 255, ${this.cursor === userParty.length + 1 ? 1 : 0.4})`;
				ctx.fillText(`Back`, 6, 125 - 16);
				break;

			case LocalScreen.ExitConfirmation:
				ctx.font = '16px zig';
				ctx.fillStyle = `rgba(255, 255, 255, 1)`;
				ctx.fillText(`Exit game and return to title screen ?`, 6, 16);
				ctx.fillStyle = `rgba(255, 255, 255, ${this.cursor === 1 ? 1 : 0.4})`;
				ctx.fillText(`Yes`, 6, 34);
				ctx.fillStyle = `rgba(255, 255, 255, ${this.cursor === 2 ? 2 : 0.4})`;
				ctx.fillText(`No`, 6, 52);
				break;

			default:
				throw new Error('Unexpected behavior while rendering at PauseMenuState');
		}
	}
}

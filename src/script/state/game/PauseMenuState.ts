import { ctx } from '@/global';
import { keyWasPressed } from '@/index';
import { Panel } from '@/script/gui/Panel';
import { ITEM_OBJECT_DEFS } from '@/script/interface/object/item_object_defs';
import { ItemType } from '@/script/interface/object/ItemObjectDef';
import { Hero } from '@/script/object/party/Hero';
import { BaseState } from '@/script/state/BaseState';
import { FadeInState } from '@/script/state/game/FadeInState';
import { FadeOutState } from '@/script/state/game/FadeOutState';
import { GameState } from '@/script/state/game/GameState';
import { StartState } from '@/script/state/game/StartState';
import { User } from '@/script/system/model/User';
import { getWrap, padNum } from '@/utils';

const _window = window as any;

enum LocalScreen {
	Menu,
	Party,
	ExitConfirmation,
	Inventory,
}

export class PauseMenuState extends BaseState {
	private user: User;
	cursor: number;
	localScreen: LocalScreen;
	gameState: GameState;
	panel: Panel;
	constructor(user: User, gameState: GameState) {
		super();
		this.user = user;
		this.gameState = gameState;

		this.localScreen = LocalScreen.Menu;
		this.cursor = 1;

		// Will render multiple panel
		this.panel = new Panel(0, 0, 0, 0);
	}

	override update() {
		if (keyWasPressed('x') && this.localScreen === LocalScreen.Menu) {
			return _window.gStateStack.pop();
		}

		if (keyWasPressed(' ')) {
			switch (this.localScreen) {
				case LocalScreen.Inventory:
					this.cursor = 1;
					this.localScreen = LocalScreen.Menu;
					break;
			}
		}

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

					// Menu -> Inventory
					if (this.cursor === 4) {
						this.cursor = 1;
						this.localScreen = LocalScreen.Inventory;
					}

					if (this.cursor === 6) {
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
					if (this.cursor === 1)
						_window.gStateStack.push(
							new FadeInState({ r: 255, g: 255, b: 255 }, 1000, () => {
								_window.gStateStack.pop(); // PauseMenuState
								_window.gStateStack.pop(); // GameState

								_window.gStateStack.push(new StartState());

								_window.gStateStack.push(
									new FadeOutState({ r: 255, g: 255, b: 255 }, 1000, () => {
										// Do nothing...
									})
								);
							})
						);

					// no: <- Menu
					if (this.cursor === 2) {
						this.cursor = 1;
						this.localScreen = LocalScreen.Menu;
					}
					break;

				case LocalScreen.Inventory:
					if (this.cursor === this.user.items.size + 1) {
						this.cursor = 1;
						this.localScreen = LocalScreen.Menu;
						break;
					}

					let counter = 1;
					for (const [key, quantity] of this.user.items.entries()) {
						if (this.cursor === counter) {
							const itemWiki = ITEM_OBJECT_DEFS[key];
							if (itemWiki.type === ItemType.Miracle) {
								const args = { state: this.gameState, user: this.user };
								itemWiki.effect(args);
							} else if (itemWiki.type === ItemType.BattleItem) {
								const args = { state: this.gameState, user: this.user };
								itemWiki.effect(args);
							}

							break;
						}

						counter++;
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
		if (this.localScreen === LocalScreen.Inventory) {
			maxOptions = this.user.items.size + 1;
		}

		if (keyWasPressed('w')) {
			this.cursor = this.cursor - 1 < 1 ? maxOptions : this.cursor - 1;
		} else if (keyWasPressed('s')) {
			this.cursor = this.cursor + 1 > maxOptions ? 1 : this.cursor + 1;
		}
	}

	override render() {
		this.panel.x = 0;
		this.panel.y = 0;
		this.panel.width = 500;
		this.panel.height = 125;

		switch (this.localScreen) {
			case LocalScreen.Menu:
				this.panel.width = 180;
				this.panel.height = 108;
				this.panel.render();

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
				ctx.fillText('Options', 6, 84);
				ctx.fillStyle = `rgba(255, 255, 255, ${this.cursor === 6 ? 1 : 0.4})`;
				ctx.fillText('Exit', 6, 98);
				break;

			case LocalScreen.Party:
				this.panel.render();
				ctx.font = '16px zig';
				ctx.fillStyle = `rgba(255, 255, 255, 1)`;
				ctx.fillText('Party member', 6, 16);

				const userParty: string[] = this.user.getParty;
				const userAllHeroes: Map<string, Hero> = this.user.getAllHeroes;
				for (let i = 1; i <= userParty.length; i++) {
					const isThisHero = this.cursor === i;
					const memberName = userParty[i - 1];
					const hero = userAllHeroes.get(memberName)!;
					const heroInfo = `${isThisHero ? '> ' : '  '}${memberName} - Lv.${hero.level} - ${hero.currentHP}/${hero.HP}`;

					ctx.fillStyle = `rgba(255, 255, 255, ${isThisHero ? 1 : 0.4})`;
					ctx.fillText(heroInfo, 16, 16 * (i + 1) + 2);
				}

				ctx.fillStyle = `rgba(255, 255, 255, ${this.cursor === userParty.length + 1 ? 1 : 0.4})`;
				ctx.fillText(`Back`, 6, 125 - 16);
				break;

			case LocalScreen.Inventory:
				this.panel.render();
				ctx.font = '16px zig';
				ctx.fillStyle = `rgba(255, 255, 255, 1)`;
				ctx.fillText('Items', 6, 16);

				let counter = 0;
				for (const [key, quantity] of this.user.items.entries()) {
					const isThisItem = this.cursor === counter + 1;
					const itemWiki = ITEM_OBJECT_DEFS[key];
					const name = itemWiki.name;

					ctx.fillStyle = `rgba(255, 255, 255, ${isThisItem ? 1 : 0.4})`;
					ctx.fillText(`${isThisItem ? '> ' : '  '} ${padNum(quantity, '0')} - ${name}`, 18, 16 * (counter + 2) + 2);

					// Render description
					if (isThisItem) {
						// Make a chunk of text base on panel width: -
						const desc = getWrap(ctx, itemWiki.description, 500 - 6);

						// The panel
						this.panel.x = 505;
						this.panel.y = 0;
						this.panel.width = 500;
						this.panel.height = 125;
						this.panel.render();

						// Item description
						ctx.fillStyle = 'rgba(255, 255, 255, 1)';
						ctx.fillText('Description', 511, 16);
						desc.forEach((text, index) => ctx.fillText(text, 511, 16 * (index + 2) + 4));
					}
					counter++;
				}

				ctx.fillStyle = `rgba(255, 255, 255, ${this.cursor === this.user.items.size + 1 ? 1 : 0.4})`;
				ctx.fillText(`Back`, 6, 125 - 16);
				break;

			case LocalScreen.ExitConfirmation:
				this.panel.render();
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

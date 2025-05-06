import { canvas, ctx } from '@/global';
import { keyWasPressed } from '@/index';
import { Panel } from '@/script/gui/Panel';
import { Hero } from '@/script/object/party/Hero';
import { BaseState } from '@/script/state/BaseState';
import { User } from '@/script/system/model/User';

const _window = window as any;

export class UserUseItemState extends BaseState {
	cursor: number;
	user: User;
	heroListPanel: Panel;
	itemNamePanel: Panel;
	onConfirm: (selected: Hero) => void;
	itemName: string;
	constructor(user: User, itemName: string, onConfirm: (selected: Hero) => void) {
		super();
		this.cursor = 1;
		this.user = user;
		this.itemName = itemName;
		this.onConfirm = onConfirm;
		this.itemNamePanel = new Panel(canvas.width / 2 - 360 / 2, canvas.height / 2 - 240 / 2 + 260, 130, 30);
		this.heroListPanel = new Panel(canvas.width / 2 - 360 / 2, canvas.height / 2 - 240 / 2 + 280, 360, 64);
	}

	override update() {
		if (keyWasPressed('d')) this.cursor++;
		else if (keyWasPressed('a')) this.cursor--;

		if (this.cursor < 1) this.cursor = this.user.getAllHeroes.size;
		else if (this.cursor > this.user.getAllHeroes.size) this.cursor = 1;

		if (keyWasPressed('Enter')) {
			let counter = 1;
			for (const [_, hero] of this.user.getAllHeroes) {
				if (this.cursor === counter) {
					return this.onConfirm(hero);
				}
				counter++;
			}

			throw new Error('Unexpected behavior while selecting hero to perform item .effect()');
		}
	}

	override render() {
		this.heroListPanel.render();
		this.itemNamePanel.render();

		ctx.font = '16px zig';
		ctx.fillStyle = 'rgb(255, 255, 255)';
		ctx.textAlign = 'left';

		// Item
		ctx.fillText(this.itemName, this.itemNamePanel.x + 8, this.itemNamePanel.y + 20);

		// Hero list
		let counter = 1;
		for (const [heroName, hero] of this.user.getAllHeroes) {
			if (this.cursor === counter) {
				// Hero HP < 25% render with red color;
				if (hero.currentHP / hero.HP < 0.25) ctx.fillStyle = 'rgb(237, 67, 55)';
				ctx.font = '14px zig';
				ctx.fillText(`<a ${heroName} d>`, this.heroListPanel.x + 8, this.heroListPanel.y + 28);
				ctx.fillText(
					`HP: ${hero.currentHP}/${hero.HP} - Lv.${hero.level}`,
					this.heroListPanel.x + 8,
					this.heroListPanel.y + 50
				);
			}
			counter++;
		}
	}
}

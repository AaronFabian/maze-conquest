import { ctx, TILE_SIZE } from '@/global';
import { keyWasPressed } from '@/index';
import { Panel } from '@/script/gui/Panel';
import { ITEM_OBJECT_DEFS } from '@/script/interface/object/item_object_defs';
import { ItemObjectDef } from '@/script/interface/object/ItemObjectDef';
import { BaseState } from '@/script/state/BaseState';
import { User } from '@/script/system/model/User';
import { _QuadImage, getWrap, padNum } from '@/utils';

const _window = window as any;

export class ShowItemDrawerState extends BaseState {
	tileWidthCount: number;
	tileHeightCount: number;
	filteredCategories: string[] | null;
	cursor: number;
	private user: User;
	private xPos: number;
	private yPos: number;
	private onItemSelected: (selectedItem: ItemObjectDef) => void;
	items: Array<[string, number]>;
	descPanel: Panel;
	constructor(user: User, xPos: number, yPos: number, onItemSelected: (selected: ItemObjectDef) => void) {
		super();
		this.user = user;
		this.xPos = xPos;
		this.yPos = yPos;
		this.onItemSelected = onItemSelected;

		this.tileWidthCount = 20;
		this.tileHeightCount = 6;
		this.filteredCategories = null;
		this.cursor = 1;

		// Create reference for current user items
		this.items = [];
		for (const itemRef of this.user.items.entries()) {
			this.items.push(itemRef);
		}

		this.descPanel = new Panel(this.xPos, this.yPos + TILE_SIZE * this.tileHeightCount + 16, 511, 125);
	}

	filterCategory(categories: string[]) {
		if (categories.length === 0) throw new Error('Unprovided categories for filtered');
		this.items = [];
		for (const itemRef of this.user.items.entries()) {
			const [itemName, _] = itemRef;
			const itemType = ITEM_OBJECT_DEFS[itemName].type;
			if (categories.includes(itemType)) {
				this.items.push(itemRef);
			}
		}

		if (this.items.length === 0) console.warn('WARN: filtered items found nothing. Ignore if this condition correct');
	}

	override update() {
		if (keyWasPressed(' ')) return _window.gStateStack.pop();

		// TODO: There will be more items in user / this game. So the panel should be render some scroll effect
		const maxOptions = this.items.length;

		if (keyWasPressed('Enter')) {
			let counter = 0;
			for (const [key, _] of this.items) {
				const isThisItem = this.cursor === counter + 1;
				if (isThisItem) {
					return this.onItemSelected(ITEM_OBJECT_DEFS[key]);
				}
				counter++;
			}

			throw new Error('Unexpected behavior while selecting the Item ! at ShowItemDrawerState');
		}

		if (keyWasPressed('w')) {
			this.cursor = this.cursor - 1 < 1 ? maxOptions : this.cursor - 1;
		} else if (keyWasPressed('s')) {
			this.cursor = this.cursor + 1 > maxOptions ? 1 : this.cursor + 1;
		}
	}

	override render() {
		const quads = _window.gFrames.get('dialogue') as _QuadImage[];
		const cursor = _window.gImages.get('cursor') as HTMLImageElement;

		// The panel itself
		for (let y = 0; y < this.tileHeightCount; y++) {
			for (let x = 0; x < this.tileWidthCount; x++) {
				if (y > 0 && x > 0 && y < this.tileHeightCount - 1 && x < this.tileWidthCount - 1) {
					quads[4].drawImage(ctx, this.xPos + x * TILE_SIZE, this.yPos + y * TILE_SIZE);
				} else if (y === 0 && x === 0) {
					quads[0].drawImage(ctx, this.xPos + x * TILE_SIZE, this.yPos + y * TILE_SIZE);
				} else if (y === 0 && x === this.tileWidthCount - 1) {
					quads[2].drawImage(ctx, this.xPos + x * TILE_SIZE, this.yPos + y * TILE_SIZE);
				} else if (y === this.tileHeightCount - 1 && x === 0) {
					quads[6].drawImage(ctx, this.xPos + x * TILE_SIZE, this.yPos + y * TILE_SIZE);
				} else if (y === this.tileHeightCount - 1 && x === this.tileWidthCount - 1) {
					quads[8].drawImage(ctx, this.xPos + x * TILE_SIZE, this.yPos + y * TILE_SIZE);
				} else if (y === this.tileHeightCount - 1 && x > 0) {
					quads[7].drawImage(ctx, this.xPos + x * TILE_SIZE, this.yPos + y * TILE_SIZE);
				} else if (y > 0 && x === 0) {
					quads[3].drawImage(ctx, this.xPos + x * TILE_SIZE, this.yPos + y * TILE_SIZE);
				} else if (y > 0 && x === this.tileWidthCount - 1) {
					quads[5].drawImage(ctx, this.xPos + x * TILE_SIZE, this.yPos + y * TILE_SIZE);
				} else if (y === 0) {
					quads[1].drawImage(ctx, this.xPos + x * TILE_SIZE, this.yPos + y * TILE_SIZE);
				}
			}
		}

		//
		ctx.font = '16px zig';
		let counter = 0;
		for (const [key, quantity] of this.items) {
			const isThisItem = this.cursor === counter + 1;
			const itemWiki = ITEM_OBJECT_DEFS[key];
			const name = itemWiki.name;

			if (isThisItem) ctx.drawImage(cursor, this.xPos + 6, this.yPos + 23 + counter * 16);
			ctx.fillStyle = `rgba(56, 56, 56, ${isThisItem ? 1 : 0.6})`;
			ctx.fillText(`${padNum(quantity, '0')} - ${name}`, this.xPos + 26, this.yPos + 16 * (counter + 2) + 2);

			// Render description
			if (isThisItem) {
				// Make a chunk of text base on panel width: -
				const desc = getWrap(ctx, itemWiki.description, 500 - 6);

				// The panel
				this.descPanel.render();

				// Item description
				ctx.fillStyle = 'rgba(56, 56, 56, 1)';
				ctx.fillText('Description', this.xPos + 8, this.yPos * 2 + 18);
				ctx.fillStyle = 'rgba(255, 255, 255, 1)';
				desc.forEach((text, index) =>
					ctx.fillText(text, this.xPos + 6, this.yPos * 2 + 16 * (index + 2) + 4 + TILE_SIZE * this.tileHeightCount)
				);
			}
			counter++;
		}
	}
}

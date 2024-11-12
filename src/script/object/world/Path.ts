import { ctx } from '@/global';
import { AABB } from '@/script/interface/game/AABB';
import { Player } from '@/script/object/entity/Player';
import { MapButton } from '@/script/object/world/MapButton';
import { BattleState } from '@/script/state/game/BattleState';
import { CurtainOpenState } from '@/script/state/game/CurtainOpenState';
import { FadeInState } from '@/script/state/game/FadeInState';
import { FadeOutState } from '@/script/state/game/FadeOutState';
import { Level } from '@/script/world/Level';
import { MazeObjectType } from '@/script/world/internal/Maze';
import { World } from '@/script/world/World';
import { _QuadImage } from '@/utils';

const _window = window as any;

enum BlockType {
	NONE = 0,
	RED = 1,
	WAY = 2,
}

export class Path {
	structure: number[][] | null;
	spriteId: number | null;
	xPos: number;
	yPos: number;
	renderPosY: number;
	renderPosX: number;
	level: Level;
	mapButtons: MapButton[];
	isDangerPath: boolean;
	mazeObjectType: MazeObjectType;
	isPlayerCollided: boolean;

	constructor(level: World, xPos: number, yPos: number, renderPosX: number, renderPosY: number) {
		this.level = level as Level;
		this.xPos = xPos;
		this.yPos = yPos;
		this.renderPosX = renderPosX;
		this.renderPosY = renderPosY;
		this.structure = null;
		this.spriteId = null;
		this.mapButtons = [];
		this.isDangerPath = false;
		this.isPlayerCollided = false;

		this.mazeObjectType = this.level.maze.data[this.yPos][this.xPos];
	}

	generate(currentMapPartX: number, currentMapPartY: number) {
		const map = this.level.maze.data;

		// If this path itself is WALL (1) or EDGE WALL (7) then just generate outer wall
		if (this.mazeObjectType === MazeObjectType.WALL || this.mazeObjectType === MazeObjectType.SPACE) {
			const structure: number[][] = [];
			for (let y = 0; y <= 4; y++) {
				structure.push([]);
				for (let x = 0; x <= 4; x++) {
					// The corner of the block don't need to check, make more efficient performance
					structure[y].push(BlockType.NONE);
				}
			}

			this.structure = structure;
			this.spriteId = 17;

			return;
		}

		// Check what ID from this path perspective
		// Check left
		const left = map[this.yPos][this.xPos - 1];

		// Check right
		const right = map[this.yPos][this.xPos + 1];

		// Check bottom
		const bottom = map[this.yPos + 1][this.xPos];

		// Check top
		const top = map[this.yPos - 1][this.xPos];

		// Generate RED invisible wall that later evaluate player movement
		const structure: number[][] = [];
		for (let y = 0; y <= 4; y++) {
			structure.push([]);
			for (let x = 0; x <= 4; x++) {
				if (x >= 1 && x <= 3 && y >= 1 && y <= 3) {
					structure[y].push(BlockType.NONE);
				} else structure[y].push(BlockType.RED);
			}
		}

		// Save later for sprite configuration
		const sprite = {
			left: false,
			right: false,
			top: false,
			bottom: false,
		};

		// Evaluate this path
		switch (left) {
			case MazeObjectType.SPACE:
				break;
			case MazeObjectType.WALL:
				break;

			case MazeObjectType.PATH:
				structure[1][0] = BlockType.NONE;
				structure[2][0] = BlockType.NONE;
				structure[3][0] = BlockType.NONE;
				sprite.left = true;

				// const edgeX = this.xPos - this.level.currentMapPartX! * 15;
				const edgeX = this.xPos - currentMapPartX! * 15;
				if (edgeX === 0) {
					structure[1][0] = BlockType.WAY;
					structure[2][0] = BlockType.WAY;
					structure[3][0] = BlockType.WAY;

					this.mapButtons.push(new MapButton('left', this.xPos, this.yPos, this.level));
				}
				break;

			default:
				console.warn(left);
				throw new Error('Unexpected configuration at Left block');
		}

		switch (right) {
			case MazeObjectType.SPACE:
				break;
			case MazeObjectType.WALL:
				break;

			case MazeObjectType.PATH:
				structure[1][4] = BlockType.NONE;
				structure[2][4] = BlockType.NONE;
				structure[3][4] = BlockType.NONE;
				sprite.right = true;

				const edgeX = this.xPos - currentMapPartX! * 15;
				if (edgeX === 14) {
					structure[1][4] = BlockType.WAY;
					structure[2][4] = BlockType.WAY;
					structure[3][4] = BlockType.WAY;

					this.mapButtons.push(new MapButton('right', this.xPos, this.yPos, this.level));
				}
				break;

			default:
				console.warn(right);
				throw new Error('Unexpected configuration at Right block');
		}

		switch (top) {
			case MazeObjectType.SPACE:
				break;
			case MazeObjectType.WALL:
				break;

			case MazeObjectType.PATH:
				structure[0][1] = BlockType.NONE;
				structure[0][2] = BlockType.NONE;
				structure[0][3] = BlockType.NONE;
				sprite.top = true;

				const edgeY = this.yPos - currentMapPartY! * 8;
				if (edgeY === 0) {
					structure[0][1] = BlockType.WAY;
					structure[0][2] = BlockType.WAY;
					structure[0][3] = BlockType.WAY;

					this.mapButtons.push(new MapButton('top', this.xPos, this.yPos, this.level));
				}
				break;

			default:
				console.warn(top);
				throw new Error('Unexpected configuration at Top block');
		}

		switch (bottom) {
			case MazeObjectType.SPACE:
				break;
			case MazeObjectType.WALL:
				break;

			case MazeObjectType.PATH:
				structure[4][1] = BlockType.NONE;
				structure[4][2] = BlockType.NONE;
				structure[4][3] = BlockType.NONE;
				sprite.bottom = true;

				const edgeY = this.yPos - currentMapPartY! * 8;
				if (edgeY === 7) {
					structure[4][1] = BlockType.WAY;
					structure[4][2] = BlockType.WAY;
					structure[4][3] = BlockType.WAY;

					this.mapButtons.push(new MapButton('bottom', this.xPos, this.yPos, this.level));
				}
				break;

			default:
				console.warn(bottom);
				throw new Error('Unexpected configuration at Bottom block');
		}

		this.structure = structure;

		// Decide which sprite to render
		let spriteId = 7;
		if (!sprite.left && sprite.right && !sprite.top && sprite.bottom) spriteId = 0;
		else if (sprite.left && sprite.right && !sprite.top && sprite.bottom) spriteId = 1;
		else if (sprite.left && !sprite.right && !sprite.top && sprite.bottom) spriteId = 2;
		else if (sprite.left && sprite.right && !sprite.top && !sprite.bottom) spriteId = 3;
		else if (!sprite.left && !sprite.right && sprite.top && sprite.bottom) spriteId = 4;
		else if (!sprite.left && !sprite.right && !sprite.top && sprite.bottom) spriteId = 5;
		else if (!sprite.left && sprite.right && sprite.top && sprite.bottom) spriteId = 6;
		else if (sprite.left && sprite.right && sprite.top && sprite.bottom) spriteId = 7; // center
		else if (sprite.left && !sprite.right && sprite.top && sprite.bottom) spriteId = 8;
		else if (!sprite.left && !sprite.right && sprite.top && !sprite.bottom) spriteId = 9;
		else if (!sprite.left && sprite.right && !sprite.top && !sprite.bottom) spriteId = 10;
		else if (!sprite.left && !sprite.right && sprite.top && !sprite.bottom) spriteId = 11;
		else if (!sprite.left && sprite.right && sprite.top && !sprite.bottom) spriteId = 12;
		else if (sprite.left && sprite.right && sprite.top && !sprite.bottom) spriteId = 13;
		else if (sprite.left && !sprite.right && sprite.top && !sprite.bottom) spriteId = 14;
		else if (!sprite.left && !sprite.right && !sprite.top && sprite.bottom) spriteId = 15;
		else if (sprite.left && !sprite.right && !sprite.top && !sprite.bottom) spriteId = 16;
		else throw new Error('Unexpected SpriteId configuration');

		this.spriteId = spriteId;
	}

	private evaluate(player: Player): boolean {
		const level = player.level as Level;

		for (let y = 0; y <= 4; y++) {
			for (let x = 0; x <= 4; x++) {
				const block = this.structure![y][x];
				if (block === BlockType.NONE || block === BlockType.WAY) continue;

				// Using AABB
				// level.currentMapPartX!;
				const box1: AABB = {
					// Path
					x: (this.xPos - 15 * level.currentMapPartX!) * 80 + x * 16,
					y: (this.yPos - 8 * level.currentMapPartY!) * 80 + y * 16,
					width: 16,
					height: 16,
				};
				const box2: AABB = {
					// Player
					x: player.x,
					y: player.y,
					width: player.width,
					height: player.height,
				};

				// If the Player hit the collision box then cancel the movement
				if (this.checkCollision(box1, box2)) {
					return true;
				}
			}
		}

		return false;

		/**
		 * TODO:
		 * - Refactor code, Player reference looks weird
		 */
	}

	private checkBattle(player: Player) {
		if (this.mazeObjectType !== MazeObjectType.ENEMY) return;

		// Using AABB
		const box1: AABB = {
			// Path
			x: this.renderPosX * 80,
			y: this.renderPosY * 80,
			width: 80,
			height: 80,
		};
		const box2: AABB = {
			// Player
			x: player.x,
			y: player.y,
			width: player.width,
			height: player.height,
		};

		if (this.checkCollision(box1, box2)) {
			this.beginBattle();
		}
	}

	beginBattle() {
		// 01 We are going to Fade in and Fade out twice
		_window.gStateStack.push(
			new FadeInState({ r: 0, g: 0, b: 0 }, 500, () => {
				_window.gStateStack.push(
					new FadeOutState({ r: 0, g: 0, b: 0 }, 500, () => {
						_window.gStateStack.push(
							new FadeInState({ r: 0, g: 0, b: 0 }, 500, () => {
								// 02 In this FadeInState we Load the BattleState
								_window.gStateStack.push(new BattleState(this.level));

								_window.gStateStack.push(new CurtainOpenState({ r: 0, g: 0, b: 0 }, 500, 500, () => {}));

								// Whatever the Player choose to run or win then change this Path MazeObjectType to normal
								this.mazeObjectType = MazeObjectType.PATH;
							})
						);
					})
				);
			})
		);
	}

	private checkCollision(box1: AABB, box2: AABB): boolean {
		return (
			box1.x < box2.x + box2.width &&
			box1.x + box1.width > box2.x &&
			box1.y < box2.y + box2.height &&
			box1.y + box1.height > box2.y
		);
	}

	update() {
		// Check for collisions before moving
		this.isPlayerCollided = false;

		// Evaluate Player movement first
		if (this.evaluate(this.level.world.player)) {
			this.isPlayerCollided = true;
			return;
		}

		// The map button will be trigger the shift and go to next map if collide
		for (const mapBtn of this.mapButtons) {
			mapBtn.update();
		}

		// The Path will check whether should go to battle field or not
		this.checkBattle(this.level.world.player);
	}

	render() {
		const sprites = _window.gFrames.get('level1') as _QuadImage[];
		if (!this.spriteId === null) throw new Error('[Path] spriteId found null');
		sprites[this.spriteId!].drawImage(ctx, this.renderPosX * 80, this.renderPosY * 80);

		for (let y = 0; y <= 4; y++) {
			for (let x = 0; x <= 4; x++) {
				const block = this.structure![y][x];

				ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
				if (block === BlockType.RED)
					// For debugging purpose
					ctx.fillRect(this.renderPosX * 80 + 16 * x, this.renderPosY * 80 + 16 * y, 16, 16);

				ctx.fillStyle = 'rgba(0, 0, 255, 0.2)';
				if (block === BlockType.WAY)
					// For debugging purpose
					ctx.fillRect(this.renderPosX * 80 + 16 * x, this.renderPosY * 80 + 16 * y, 16, 16);
			}
		}

		ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
		if (this.mazeObjectType === MazeObjectType.ENEMY)
			// For debugging purpose
			ctx.fillRect(this.renderPosX * 80, this.renderPosY * 80, 80, 80);
	}
}

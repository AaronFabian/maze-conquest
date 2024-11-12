import { canvas, ctx } from '@/global';
import { ENTITY_DEFS } from '@/script/interface/entity/entity_defs';
import { AABB } from '@/script/interface/game/AABB';
import { Entity } from '@/script/object/entity/Entity';
import { Campfire } from '@/script/object/world/Campfire';
import { Portal } from '@/script/object/world/Portal';
import { EntityBaseState } from '@/script/state/entity/EntityBaseState';
import { NPCIdleState } from '@/script/state/entity/npc/NPCIdleState';
import { PlayerWalkState } from '@/script/state/entity/player/PlayerWalkState';
import { GameState } from '@/script/state/game/GameState';
import { StateMachine } from '@/script/state/StateMachine';
import { TOWN_MAP } from '@/script/world/map/town_map';
import { World } from '@/script/world/World';

const _window = window as any;

export class Town extends World {
	gameState: GameState;
	maps: AABB[];
	portal!: Portal;
	campfire!: Campfire;
	npcs: Entity[];
	allowInteract: boolean;
	constructor(gameState: GameState) {
		super();

		this.maps = TOWN_MAP.rectangleCollision;
		this.gameState = gameState;

		// 01 In general NPC interaction almost the same so better just save it to array of Entity
		this.npcs = this.generateNPCs();

		this.allowInteract = true;
	}

	override setup() {
		// Because this os the beginning then place Player inside the collision block
		this.placePlayer(2 * 16, 9 * 16);

		// This is the portal where the Player will go to Maze aka Level at code
		this.portal = new Portal(this.gameState.player);

		// Campfire that Player can go save the game progress
		this.campfire = new Campfire(this.gameState.player);
	}

	private generateNPCs(): Entity[] {
		const npcs: Entity[] = [];

		// 01
		const beginningNPCDef = ENTITY_DEFS.beginningNPC;
		const beginningNPC = new Entity(beginningNPCDef);

		const beginningNPCState = new Map<string, () => EntityBaseState>();
		beginningNPCState.set('idle', () => new NPCIdleState(beginningNPC, this.gameState.player));
		beginningNPC.setStateMachine = new StateMachine(beginningNPCState);
		beginningNPC.changeState('idle');

		npcs.push(beginningNPC);

		return npcs;
	}

	placePlayer(x: number, y: number) {
		this.gameState.player.x = x;
		this.gameState.player.y = y;
	}

	private checkCollision(box1: AABB, box2: AABB): boolean {
		return (
			box1.x < box2.x + box2.width &&
			box1.x + box1.width > box2.x &&
			box1.y < box2.y + box2.height &&
			box1.y + box1.height > box2.y
		);
	}

	override update() {
		const player = this.gameState.player;

		if (this.allowInteract) {
			this.npcs.forEach(npc => npc.update());

			player.update();

			if (player.stateMachine!.getCurrent() instanceof PlayerWalkState)
				for (const rect of this.maps) {
					const box2: AABB = {
						x: this.gameState.player.x,
						y: this.gameState.player.y,
						width: this.gameState.player.width,
						height: this.gameState.player.height,
					};
					if (this.checkCollision(rect, box2)) {
						// Here cancel the Player movement
						const playerDirection = player.direction;
						if (playerDirection === 'left') {
							player.x += 2;
						} else if (playerDirection === 'right') {
							player.x += -2;
						} else if (playerDirection === 'up') {
							player.y += 2;
						} else if (playerDirection === 'down') {
							player.y += -2;
						}
						break;
					}
				}

			this.portal.update();
			this.campfire.update();
		} else {
			player.currentAnimation!.update();
			this.portal.currentAnimation.update();
			this.campfire.currentAnimation.update();
			this.npcs.forEach(npc => npc.currentAnimation?.update());
		}
	}

	override render() {
		ctx.save();

		const img: HTMLImageElement = _window.gImages.get('town-prototype');
		ctx.translate(canvas.width / 2 - img.width / 2, canvas.height / 2 - img.height / 2);
		ctx.drawImage(img, 0, 0);

		this.npcs.forEach(npc => npc.render());
		this.gameState.player.render();
		this.portal.render();
		this.campfire.render();

		// debug-purpose
		ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
		for (const rect of this.maps) ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

		ctx.restore();
	}
}

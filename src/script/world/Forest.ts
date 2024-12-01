import { canvas, ctx } from '@/global';
import { ENTITY_DEFS } from '@/script/interface/entity/entity_defs';
import { AABB } from '@/script/interface/game/AABB';
import { Entity } from '@/script/object/entity/Entity';
import { Player } from '@/script/object/entity/Player';
import { StateMachine } from '@/script/state/StateMachine';
import { EntityBaseState } from '@/script/state/entity/EntityBaseState';
import { NPCIdleState } from '@/script/state/entity/npc/NPCIdleState';
import { PlayerIdleState } from '@/script/state/entity/player/PlayerIdleState';
import { PlayerWalkState } from '@/script/state/entity/player/PlayerWalkState';
import { TutorialState } from '@/script/state/game/TutorialState';
import { World } from '@/script/world/World';

const _window = window as any;

export class Forest extends World {
	state: TutorialState;
	npc: Entity;
	player: Player;
	hold: boolean;
	constructor(state: TutorialState) {
		super();

		// this.maps =
		this.hold = true;
		this.state = state;

		// 02 Create player data
		this.player = new Player(ENTITY_DEFS.player, this);

		// Defining Player state
		const playerState = new Map<string, () => EntityBaseState>();
		playerState.set('idle', () => new PlayerIdleState(this.player));
		playerState.set('walk', () => new PlayerWalkState(this.player, this));

		this.player.setStateMachine = new StateMachine(playerState);
		this.player.changeState('idle');
		this.player.x = 112;
		this.player.y = 208 + 32;

		this.npc = new Entity(ENTITY_DEFS.beginningNPC);
		this.npc.x = 112;
		this.npc.y = 208;

		const beginningNPCState = new Map<string, () => EntityBaseState>();
		beginningNPCState.set('idle', () => new NPCIdleState(this.npc, this.player));

		this.npc.setStateMachine = new StateMachine(beginningNPCState);
		this.npc.changeState('idle');
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
		if (this.hold) {
			this.npc.currentAnimation?.update();
			this.player.currentAnimation?.update();
		} else {
			this.npc.update();
			this.player.update();
		}
	}

	override render() {
		ctx.save();

		const img: HTMLImageElement = _window.gImages.get('forest-prototype');
		ctx.translate(canvas.width / 2 - img.width / 2, canvas.height / 2 - img.height / 2);
		ctx.drawImage(img, 0, 0);

		this.npc.render();
		this.player.render();

		ctx.restore();
	}
}

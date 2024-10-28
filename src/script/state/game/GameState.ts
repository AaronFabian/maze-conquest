import { TWEEN } from '@/global';
import { keyWasPressed } from '@/index';
import { ENTITY_DEFS } from '@/script/interface/entity/entity_defs';
import { EntityDef } from '@/script/interface/entity/EntityDef';
import { Player } from '@/script/object/entity/Player';
import { BaseState } from '@/script/state/BaseState';
import { EntityBaseState } from '@/script/state/entity/EntityBaseState';
import { PlayerIdleState } from '@/script/state/entity/player/PlayerIdleState';
import { PlayerWalkState } from '@/script/state/entity/player/PlayerWalkState';
import { PauseMenuState } from '@/script/state/game/PauseMenuState';
import { StateMachine } from '@/script/state/StateMachine';
import { Level } from '@/script/world/Level';
import { Town } from '@/script/world/Town';
import { World, WorldType } from '@/script/world/World';

const _window = window as any;

export class GameState extends BaseState {
	level: World;
	player: Player;
	disableKey: boolean;
	worlds: Map<WorldType, () => World>;

	constructor() {
		super();
		this.disableKey = false;

		// 01 Generate world level
		this.worlds = new Map<WorldType, () => World>();
		this.worlds.set(WorldType.Level, () => new Level(this));
		this.worlds.set(WorldType.Town, () => new Town(this));

		this.level = this.worlds.get(WorldType.Town)!();

		// 02 Create player data
		const playerDef: EntityDef = ENTITY_DEFS.player;
		this.player = new Player(playerDef, this.level);

		// Defining Player state
		const playerState = new Map<string, () => EntityBaseState>();
		playerState.set('idle', () => new PlayerIdleState(this.player));
		playerState.set('walk', () => new PlayerWalkState(this.player, this.level));

		// use defined state and assign to the late init and immediately to 'idle' state
		// one thing should considered is state name and animation name could be different,
		// that means, changing state does not mean changing the animation !
		this.player.setStateMachine = new StateMachine(playerState);
		this.player.changeState('idle');

		// 03 Setup maze level
		this.level.setup();

		console.log('%c -game state-', 'color: #30AEBF;');
	}

	override update() {
		if (!this.disableKey) {
			this.level.update();

			if (keyWasPressed(' ') || keyWasPressed('o')) {
				_window.gStateStack.push(new PauseMenuState());
			}
		}
	}

	override render() {
		const level = this.level;

		level.render();

		// // ! Game Log
		// ctx.font = '8px zig';
		// ctx.fillStyle = `white`;
		// ctx.fillText(`[Log] map part x:${level.currentMapPartX} y:${level.currentMapPartY}`, 16, canvas.height - 16);
	}

	override exit = () => TWEEN.removeAll();
}

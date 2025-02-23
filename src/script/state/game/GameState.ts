import { GUEST_DATA, TWEEN } from '@/global';
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
import { User } from '@/script/system/model/User';
import { Level } from '@/script/world/Level';
import { Town } from '@/script/world/Town';
import { World, WorldType } from '@/script/world/World';

const _window = window as any;

export class GameState extends BaseState {
	level: World;
	player: Player;
	disableKey: boolean;
	worlds: Map<WorldType, () => World>;
	user: User;

	constructor(user: User) {
		super();

		this.user = user;

		// 00
		this.disableKey = false;

		// 00 Put all worlds but don't load any World yet
		this.worlds = new Map<WorldType, () => World>();
		this.worlds.set(WorldType.Town, () => new Town(this));
		this.worlds.set(WorldType.Level, () => new Level(this, this.user));

		// 01 Generate world level
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

		console.log(this.user);
		console.log('%c -game state-', 'color: #30AEBF;');
	}

	set setWorld(worldType: WorldType) {
		if (!this.worlds.has(worldType))
			throw new Error('Fatal error while set world where world type not found at GameState !');

		this.level = this.worlds.get(worldType)!();
	}

	changeWorld(worldType: WorldType) {
		if (this.player === undefined)
			throw new Error('Unexpected error while changing the world. Maybe forgot to instantiate the Player ?');

		// Do not use this for instantiate, because player is not yet if this fn called at instantiate
		this.setWorld = worldType;
		this.player.level = this.level; // Reset Player Level reference to new Level reference
		this.level.setup();
	}

	override update() {
		if (!this.disableKey) {
			this.level.update();

			if (keyWasPressed(' ')) {
				_window.gStateStack.push(new PauseMenuState(this.user, this));
			}
		}
	}

	override render() {
		this.level.render();
	}

	override exit = () => TWEEN.removeAll();
}

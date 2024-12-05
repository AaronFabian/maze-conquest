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

	constructor() {
		super();
		this.disableKey = false;

		// 00 Put all worlds but don't load any World yet
		this.worlds = new Map<WorldType, () => World>();
		this.worlds.set(WorldType.Level, () => new Level(this));
		this.worlds.set(WorldType.Town, () => new Town(this));

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

		const DUMMY_PLAYER_DATA = {
			_uid: 9999,
			items: new Map<string, number>([
				['phoenix-feather', 99],
				['potion', 99],
			]),
			allHeroes: {
				['soldier']: {
					level: 1,
				},
				['wizard']: {
					level: 1
				}
			},
			party: ['soldier', 'wizard'],
			active: true,
			username: 'Aaron Fabian',
			createdAt: Date.now(),
		};

		this.user = new User(DUMMY_PLAYER_DATA);

		console.log(this.user);
		console.log('%c -game state-', 'color: #30AEBF;');
	}

	set setWorld(worldType: WorldType) {
		if (!this.worlds.has(worldType))
			throw new Error('Fatal error while set world where world type not found at GameState !');

		this.level = this.worlds.get(worldType)!();
	}

	override update() {
		if (!this.disableKey) {
			this.level.update();

			if (keyWasPressed(' ') || keyWasPressed('x')) {
				_window.gStateStack.push(new PauseMenuState(this.user, this));
			}
		}
	}

	override render() {
		this.level.render();
	}

	override exit = () => TWEEN.removeAll();
}

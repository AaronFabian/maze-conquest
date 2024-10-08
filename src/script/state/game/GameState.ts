import { TWEEN } from '@/global';
import { ENTITY_DEFS } from '@/script/interface/entity/entity_defs';
import { EntityDef } from '@/script/interface/entity/EntityDef';
import { Player } from '@/script/object/entity/Player';
import { BaseState } from '@/script/state/BaseState';
import { EntityBaseState } from '@/script/state/entity/EntityBaseState';
import { PlayerIdleState } from '@/script/state/entity/player/PlayerIdleState';
import { StateMachine } from '@/script/state/StateMachine';
import { Level } from '@/script/world/Level';
import { PlayerWalkState } from '../entity/player/PlayerWalkState';

const _window = window as any;

export class GameState extends BaseState {
	level: Level;
	player: Player;
	disableKey: boolean;

	constructor() {
		super();
		this.disableKey = false;

		// 01 Generate world level
		this.level = new Level(this);

		// 02 Create player data
		const playerDef: EntityDef = ENTITY_DEFS.player;
		this.player = new Player(playerDef, this.level);

		// defining ship state
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

		console.log(this.level.maze.data);
		console.log('%c -game state-', 'color: #30AEBF;');
	}

	override update() {
		if (!this.disableKey) {
			this.level.update();
		}
	}

	override render() {
		this.level.render();
	}

	override exit = () => TWEEN.removeAll();
}

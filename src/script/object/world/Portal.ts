import { ctx, Tween } from '@/global';
import { Panel } from '@/script/gui/Panel';
import { AABB } from '@/script/interface/game/AABB';
import { GAME_OBJECT_DEFS } from '@/script/interface/object/game_object_defs';
import { GameObject } from '@/script/object/GameObject';
import { Player } from '@/script/object/entity/Player';
import { FadeInState } from '@/script/state/game/FadeInState';
import { FadeOutState } from '@/script/state/game/FadeOutState';
import { PromptState } from '@/script/state/game/PromptState';
import { Town } from '@/script/world/Town';
import { WorldType } from '@/script/world/World';

const _window = window as any;

enum State {
	Waiting,
	Prompt,
	Nothing,
}

export class Portal extends GameObject {
	player: Player;
	triggerBtnX: number;
	triggerBtnY: number;
	triggerBtnWidth: number;
	triggerBtnHeight: number;
	panel: Panel;
	town: Town;
	state: State;
	constructor(player: Player) {
		super(GAME_OBJECT_DEFS.portal);

		// 01 Save the player & Town reference for trigger button
		this.player = player;
		this.town = player.level as Town;

		// 02 This property below is for the trigger button that move to other world
		this.triggerBtnX = this.x;
		this.triggerBtnY = this.y + 16;
		this.triggerBtnWidth = this.width;
		this.triggerBtnHeight = this.height / 2;

		// 03 When the player enter the Portal then show some prompt
		// This panel will generated from the center even the position.x is < 0
		// because the Town world shift our canvas
		this.panel = new Panel(-68, 294, 360, 64);

		// A local state for switching logic
		this.state = State.Waiting;
	}

	private waitingState() {
		const playerAABB: AABB = {
			x: this.player.x,
			y: this.player.y,
			width: this.player.width,
			height: this.player.height,
		};
		const portalTriggerAABB: AABB = {
			x: this.triggerBtnX,
			y: this.triggerBtnY,
			width: this.triggerBtnWidth,
			height: this.triggerBtnHeight,
		};
		const portalAABB: AABB = {
			x: this.x,
			y: this.y,
			width: this.width,
			height: this.height,
		};

		// Small appealing when the Player hover or at the portal than make the Animation faster a bit
		if (this.checkCollision(playerAABB, portalAABB)) {
			this.currentAnimation.interval = 2;
		} else {
			this.currentAnimation.interval = 8;
		}

		if (this.checkCollision(playerAABB, portalTriggerAABB)) {
			this.state = State.Prompt;

			this.town.allowInteract = false;

			_window.gStateStack.push(
				new PromptState(this.town, {
					onYes: () => {
						this.state = State.Nothing;
						this.player.direction = 'down';
						this.player.setAnimation = 'walk-' + this.player.direction;

						// Do not push another at FadeInState onFinish.
						// We want the Player looks like going in to the Portal gate
						_window.gStateStack.push(new FadeInState({ r: 0, g: 0, b: 0 }, 1500, () => {}));

						new Tween(this.player)
							.to({ y: this.player.y + 16 }, 1500)
							.onComplete(() => {
								// Do another stuff here
								//

								// 01 Reset the reference
								this.town.gameState.setWorld = WorldType.Level;
								this.player.level = this.town.gameState.level;
								this.town.gameState.level.setup();

								// 02 Slightly tweak to make Player looks waiting the FadeOutState
								this.player.changeState('idle');

								// 03
								_window.gStateStack.push(new FadeOutState({ r: 0, g: 0, b: 0 }, 1500, () => {}));
							})
							.start();
					},
					onNo: () => {
						this.state = State.Nothing;

						// Player already at walk state
						this.player.direction = 'up';
						this.player.setAnimation = 'walk-' + this.player.direction;
						// this.player.changeState('walk');

						new Tween(this.player)
							.to({ y: this.player.y - 16 }, 500)
							.onComplete(() => {
								this.state = State.Waiting;
								this.town.allowInteract = true;
							})
							.start();
					},
				})
			);
		}
	}

	private promptingState() {}

	override update() {
		super.update();
		switch (this.state) {
			case State.Waiting:
				this.waitingState();
				break;

			case State.Prompt:
				this.promptingState();
				break;

			case State.Nothing:
				break;

			default:
				throw new Error('Unexpected error while updating the Portal object');
		}
	}

	override render() {
		super.render();

		switch (this.state) {
			case State.Waiting:
				this.waitingState();
				break;

			case State.Prompt:
				this.panel.render();
				ctx.font = '16px zig';
				ctx.fillStyle = 'rgba(255, 255, 255, 1)';
				ctx.fillText('Strange aura appear from', this.panel.x + 3, this.panel.y + 16);
				ctx.fillText('the portal. Enter the maze?', this.panel.x + 3, this.panel.y + 32);
				ctx.fillText('*a, d, Enter key to select', this.panel.x + 3, this.panel.y + 48);
				break;

			case State.Nothing:
				break;

			default:
				throw new Error('Unexpected error while updating the Portal object');
		}

		// debug-purpose
		ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
		ctx.fillRect(this.x, this.y, this.width, this.height);

		ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
		ctx.fillRect(this.triggerBtnX, this.triggerBtnY, this.triggerBtnWidth, this.triggerBtnHeight);
	}
}

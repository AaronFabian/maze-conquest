/**
 * Author: Aaron Fabian Saputra
 * Title: Maze Conquest
 * A single game where player will explore the maze, every level will
 * recorded and post online to see someone explored the highest maze game.
 */

// *** Application Entry Point ***
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

import { canvas, ctx, firebaseConfig, input, TWEEN } from '@/global';
import { StartState } from '@/script/state/game/StartState';
import { SystemError } from '@/script/system/error/SystemError';
import { FatalErrorScreen } from '@/script/system/screen/FatalErrorScreen';
import { _LoadingAssetsScreen } from '@/script/system/screen/LoadingAssetScreen';
import { generateQuads, newImage } from '@/utils';

const _window = window as any;
let _msPrev: number = window.performance.now();
let _fps = 60;
let _fpsInterval = 1000 / _fps;

async function init() {
	// Initialize Firebase
	const app = initializeApp(firebaseConfig);
	const _ = getAnalytics(app); // analytics
	getAuth(app);

	// Initialize Cloud Firestore and get a reference to the service
	const __ = getFirestore(app); // db

	const loadingAssetScreen = new _LoadingAssetsScreen<HTMLImageElement>();
	loadingAssetScreen.push(newImage('ui/background.png', 'start-screen-bg'));
	loadingAssetScreen.push(newImage('ui/dialogue.png', 'dialogue'));
	loadingAssetScreen.push(newImage('component/level1-tileset.png', 'level1-tileset'));
	loadingAssetScreen.push(newImage('component/level1.png', 'level1'));
	loadingAssetScreen.push(newImage('component/town-prototype.png', 'town-prototype'));
	loadingAssetScreen.push(newImage('component/forest-prototype.png', 'forest-prototype'));
	loadingAssetScreen.push(newImage('component/wrap-effect.png', 'wrap-effect'));
	loadingAssetScreen.push(newImage('component/level1-battlefield.png', 'level1-battlefield'));
	loadingAssetScreen.push(newImage('component/character/player.png', 'player'));
	loadingAssetScreen.push(newImage('component/character/soldier.png', 'soldier'));
	loadingAssetScreen.push(newImage('component/character/wizard.png', 'wizard'));
	loadingAssetScreen.push(newImage('component/character/orc.png', 'orc'));
	loadingAssetScreen.push(newImage('component/character/npcs.png', 'npcs'));
	loadingAssetScreen.push(newImage('component/character/skeleton.png', 'skeleton'));
	loadingAssetScreen.push(newImage('component/cursor.png', 'cursor'));
	loadingAssetScreen.push(newImage('component/object/portal.png', 'portal'));
	loadingAssetScreen.push(newImage('component/object/campfire.png', 'campfire'));
	loadingAssetScreen.push(newImage('component/object/door.png', 'door'));

	await loadingAssetScreen.load(image => _window.gImages.set(image.alt, image));

	_window.gFrames.set('door', generateQuads(_window.gImages.get('door'), 16, 32));
	_window.gFrames.set('npcs', generateQuads(_window.gImages.get('npcs'), 32, 32));
	_window.gFrames.set('orc', generateQuads(_window.gImages.get('orc'), 100, 100));
	_window.gFrames.set('level1', generateQuads(_window.gImages.get('level1'), 80, 80));
	_window.gFrames.set('player', generateQuads(_window.gImages.get('player'), 32, 32));
	_window.gFrames.set('portal', generateQuads(_window.gImages.get('portal'), 32, 32));
	_window.gFrames.set('wizard', generateQuads(_window.gImages.get('wizard'), 100, 100));
	_window.gFrames.set('soldier', generateQuads(_window.gImages.get('soldier'), 100, 100));
	_window.gFrames.set('campfire', generateQuads(_window.gImages.get('campfire'), 16, 16));
	_window.gFrames.set('dialogue', generateQuads(_window.gImages.get('dialogue'), 16, 16));
	_window.gFrames.set('skeleton', generateQuads(_window.gImages.get('skeleton'), 100, 100));
	_window.gFrames.set('wrap-effect', generateQuads(_window.gImages.get('wrap-effect'), 32, 32));
	_window.gFrames.set('level1-tileset', generateQuads(_window.gImages.get('level1-tileset'), 16, 16));

	// _window.gStateStack.push(new LeaderboardState());
	_window.gStateStack.push(new StartState());
	// _window.gStateStack.push(new GameState(new User(GUEST_DATA)));

	animation();
}

export function keyWasPressed(key: string): boolean {
	return input.keyboard.keysPressed[key];
}

function update() {
	TWEEN.update();

	_window.gStateStack.update();

	input.keyboard.keysPressed = {};
}

window.addEventListener('keypress', ({ key }) => {
	input.keyboard.keysPressed[key] = true;
});

window.addEventListener('keyup', ({ key }) => {
	input.keyboard.isDown[key] = false;
});

window.addEventListener('keydown', ({ key }) => {
	input.keyboard.isDown[key] = true;
});

function render() {
	ctx.reset();
	_window.gStateStack.render();
}

function animation() {
	const animationId = requestAnimationFrame(animation);

	// treat all computer have the same execute speed (est: 60fps)
	const msNow: number = window.performance.now();
	const elapsed = msNow - _msPrev;
	if (elapsed < _fpsInterval) return;
	_msPrev = msNow - (elapsed % _fpsInterval);

	try {
		update();
		render();
	} catch (error) {
		switch (true) {
			case error instanceof SystemError:
				error.print();
				break;
			default:
				console.error('Fatal Error while animating', error);
				break;
		}

		document.title = 'Game crashed !';

		// will stop the game looping and freeze the screen so we know where crash happen
		cancelAnimationFrame(animationId);

		const ico = document.querySelector("link[rel~='icon']")! as HTMLLinkElement;
		ico.href =
			'https://firebasestorage.googleapis.com/v0/b/maze-conquest-api.firebasestorage.app/o/warning.ico?alt=media&token=018ba8d3-33a1-48ed-9dba-ad565a4653be';

		canvas.style.animation = 'shake 0.5s';

		new FatalErrorScreen(error as Error);
	}
}

init();

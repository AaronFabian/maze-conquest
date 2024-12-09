/**
 * Author: Aaron Fabian Saputra
 * Title: Maze Conquest
 * A single game where player will explore the maze, every level will
 * recorded and post online to see someone explored the highest maze game.
 */

// *** Application Entry Point ***
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

import { canvas, ctx, firebaseConfig, input, TWEEN } from '@/global';
import { StartState } from '@/script/state/game/StartState';
import { GameState } from '@/script/state/game/GameState';
import { LoadingAssetScreen } from '@/script/system/screen/LoadingAssetScreen';
import { newImage, generateQuads } from '@/utils';
import { SystemError } from '@/script/system/error/SystemError';
import { FatalErrorScreen } from '@/script/system/screen/FatalErrorScreen';
import { TutorialState } from '@/script/state/game/TutorialState';

const _window = window as any;
let _msPrev: number = window.performance.now();
let _fps = 60;
let _fpsInterval = 1000 / _fps;

async function init() {
	// Initialize Firebase
	const app = initializeApp(firebaseConfig);
	const analytics = getAnalytics(app);
	getAuth(app);

	// Initialize Cloud Firestore and get a reference to the service
	const db = getFirestore(app);

	// declare local screen only for displaying loading screen
	// in general "screen" still inherit from BaseState but they not relate to game update nor render
	const imageToAwait: Array<Promise<HTMLImageElement>> = [];
	const loadingScreen = new LoadingAssetScreen(imageToAwait);

	imageToAwait.push(newImage('ui/background.png', 'start-screen-bg', loadingScreen));
	imageToAwait.push(newImage('ui/dialogue.png', 'dialogue', loadingScreen));
	imageToAwait.push(newImage('component/level1-tileset.png', 'level1-tileset', loadingScreen));
	imageToAwait.push(newImage('component/level1.png', 'level1', loadingScreen));
	imageToAwait.push(newImage('component/town-prototype.png', 'town-prototype', loadingScreen));
	imageToAwait.push(newImage('component/forest-prototype.png', 'forest-prototype', loadingScreen));
	imageToAwait.push(newImage('component/wrap-effect.png', 'wrap-effect', loadingScreen));
	imageToAwait.push(newImage('component/level1-battlefield.png', 'level1-battlefield', loadingScreen));
	imageToAwait.push(newImage('component/character/player.png', 'player', loadingScreen));
	imageToAwait.push(newImage('component/character/soldier.png', 'soldier', loadingScreen));
	imageToAwait.push(newImage('component/character/wizard.png', 'wizard', loadingScreen));
	imageToAwait.push(newImage('component/character/orc.png', 'orc', loadingScreen));
	imageToAwait.push(newImage('component/character/npcs.png', 'npcs', loadingScreen));
	imageToAwait.push(newImage('component/character/skeleton.png', 'skeleton', loadingScreen));
	imageToAwait.push(newImage('component/cursor.png', 'cursor', loadingScreen));
	imageToAwait.push(newImage('component/object/portal.png', 'portal', loadingScreen));
	imageToAwait.push(newImage('component/object/campfire.png', 'campfire', loadingScreen));

	const resolvedImages = await Promise.all(imageToAwait);
	resolvedImages.forEach(image => _window.gImages.set(image.alt, image));

	_window.gFrames.set('level1-tileset', generateQuads(_window.gImages.get('level1-tileset'), 16, 16));
	_window.gFrames.set('dialogue', generateQuads(_window.gImages.get('dialogue'), 16, 16));
	_window.gFrames.set('level1', generateQuads(_window.gImages.get('level1'), 80, 80));
	_window.gFrames.set('player', generateQuads(_window.gImages.get('player'), 32, 32));
	_window.gFrames.set('soldier', generateQuads(_window.gImages.get('soldier'), 100, 100));
	_window.gFrames.set('orc', generateQuads(_window.gImages.get('orc'), 100, 100));
	_window.gFrames.set('wizard', generateQuads(_window.gImages.get('wizard'), 100, 100));
	_window.gFrames.set('skeleton', generateQuads(_window.gImages.get('skeleton'), 100, 100));
	_window.gFrames.set('npcs', generateQuads(_window.gImages.get('npcs'), 32, 32));
	_window.gFrames.set('portal', generateQuads(_window.gImages.get('portal'), 32, 32));
	_window.gFrames.set('campfire', generateQuads(_window.gImages.get('campfire'), 16, 16));
	_window.gFrames.set('wrap-effect', generateQuads(_window.gImages.get('wrap-effect'), 32, 32));

	// _window.gStateStack.push(new TutorialState());
	_window.gStateStack.push(new StartState());
	// _window.gStateStack.push(new GameState());

	animation();
}

export function keyWasPressed(key: string): boolean {
	return input.keyboard.keysPressed.has(key);
}

function update() {
	TWEEN.update();

	_window.gStateStack.update();

	input.keyboard.keysPressed.clear();
}

window.addEventListener('keypress', ({ key }) => {
	input.keyboard.keysPressed.set(key, true);
});

window.addEventListener('keyup', ({ key }) => {
	input.keyboard.isDown[key] = false;
});

window.addEventListener('keydown', ({ key }) => {
	input.keyboard.isDown[key] = true;
});

function render() {
	ctx.reset();

	// create responsive game screen could be define here
	// ctx.scale(1, 1);
	// ctx.translate(canvas.width * 1, canvas.height * 1);
	_window.gStateStack.render();
}

function animation() {
	const animationId = requestAnimationFrame(animation);

	// treat all computer have the same execute speed
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
		ico.href = './assets/warning.ico';

		canvas.style.animation = 'shake 0.5s';

		// new FatalErrorScreen(error as Error);
	}
}

init();

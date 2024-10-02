/**
 * Author: Aaron Fabian Saputra
 * Title: Maze Conquest
 * A single game where player will explore the maze, every level will
 * recorded and post online to see someone explored the highest maze game.
 *
 * Game World hierarchy: World (state) -> Level -> MazeGame
 */

// style for webpack to apply css and minified the html css
import '@/style.css';

// this import will make our library globally available
import '@/lib/tween.js';
import '@/lib/howler.core.min.js';

import { _QuadImage } from '@/utils';
import { StateStack } from '@/script/state/StateStack';

const _window = window as any;

// lib (non npm dependencies)
// an animation library; make our game more attractive and executes animation in asynchronous way
export const TWEEN = _window.TWEEN;
export const Tween = _window.TWEEN.Tween;

// an audio library for implementing sound in our browser; with Howl make implementing sound in browser easier.
export const Howl = _window.Howl;

export const PTM = 32;
export const TILE_SIZE = 16;

// assets
const gImages = new Map<string, HTMLImageElement>();

_window.gImages = gImages;

const gFrames = new Map<string, Array<_QuadImage>>();

_window.gFrames = gFrames;

const gSounds = new Map<string, any>();

_window.gSounds = gSounds;

const gStateStack = new StateStack();

_window.gStateStack = gStateStack;

// for later game setup
export const canvas = document.getElementById('canvas') as HTMLCanvasElement;
export const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

canvas.width = 1280;
canvas.height = 720;
canvas.style.border = '1px solid white'; // ! delete dev purpose
canvas.style.scale = '0.9'; // ! delete dev purpose

export const input = {
	mouse: {
		keysPressed: new Map<string, boolean>(),
		keysReleased: new Map<string, boolean>(),

		// x and y are coordinate based on canvas
		x: 0,
		y: 0,
	},
	keyboard: {
		keysPressed: new Map<string, boolean>(),
		isDown: <{ [key: string]: boolean }>{
			w: false,
			a: false,
			s: false,
			d: false,
		},
	},
};

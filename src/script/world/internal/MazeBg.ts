import { canvas, ctx } from '@/global';
import { Tween } from '@/lib/Tween';
import { CanvasRendering } from '@/script/interface/state/CanvasRendering';
import { Maze } from '@/script/world/internal/Maze';
import { MazeGame } from '@/script/world/internal/MazeGame';
import { random } from '@/utils';

export class MazeMapBg implements CanvasRendering {
	mazeMap: Maze;
	scrollX: number;
	scrollY: number;
	fadeOpacity: number;
	playBg: boolean;
	constructor() {
		// 00 Setup
		this.mazeMap = MazeGame.generateMazeMap();

		// 01
		const [startXFrom, startYFrom] = this.randomFrom();
		this.scrollX = startXFrom;
		this.scrollY = startYFrom;

		this.fadeOpacity = 1;

		this.playBg = true;
	}

	/**
	 * Already return real position
	 * example: 600 x 600
	 */
	// private randomFrom(): number[] {
	// 	// 01 Get the map length
	// 	const mazeMapXLength = this.mazeMap.data.length;
	// 	const mazeMapYLength = this.mazeMap.data[0].length;

	// 	// 03 In which location that the map should render first
	// 	const coordinateX = random(3, mazeMapXLength - 3);
	// 	const coordinateY = random(3, mazeMapYLength - 3);

	// 	// // Let's say it's 10 x 10
	// 	// // if from random coordinateX and coordinateY is 4 x 4
	// 	// // Then we want to move the right ->
	// 	// // if it's 8 x 4
	// 	// // Then we want to move it to bottom
	// 	// // if it's 4 x 8
	// 	// // Then we want to move it to top ^
	// 	// // if it's 8 x 8
	// 	// // Then we want to move it to left <-
	// 	// // console.log(mazeMapXLength, mazeMapYLength);
	// 	// const startXFrom = -(coordinateX * 80);
	// 	// const startYFrom = -(coordinateY * 80);

	// 	const tileSize = 80;
	// 	const halfX = mazeMapXLength / 2;
	// 	const halfY = mazeMapYLength / 2;

	// 	let offsetX = 0;
	// 	let offsetY = 0;

	// 	if (coordinateX < halfX && coordinateY < halfY) {
	// 		// Top-left quadrant → shift right
	// 		offsetX = 0;
	// 		offsetY = 0;
	// 	} else if (coordinateX >= halfX && coordinateY < halfY) {
	// 		// Top-right quadrant → shift down
	// 		offsetX = -((mazeMapXLength - 10) * tileSize); // Adjust as needed
	// 		offsetY = 0;
	// 	} else if (coordinateX < halfX && coordinateY >= halfY) {
	// 		// Bottom-left quadrant → shift up
	// 		offsetX = 0;
	// 		offsetY = -((mazeMapYLength - 10) * tileSize);
	// 	} else {
	// 		// Bottom-right quadrant → shift left
	// 		offsetX = -((mazeMapXLength - 10) * tileSize);
	// 		offsetY = -((mazeMapYLength - 10) * tileSize);
	// 	}

	// 	const startXFrom = offsetX;
	// 	const startYFrom = offsetY;

	// 	return [startXFrom, startYFrom];
	// }

	private randomFrom(): [number, number, number, number] {
		const coordinateX = random(3, this.mazeMap.data.length - 3);
		const coordinateY = random(3, this.mazeMap.data[0].length - 3);

		const startXFrom = -(coordinateX * 80);
		const startYFrom = -(coordinateY * 80);

		return [coordinateX, coordinateY, startXFrom, startYFrom];
	}

	private backgroundAnimation() {
		const [coordinateX, coordinateY, startXFrom, startYFrom] = this.randomFrom();
		this.scrollX = startXFrom;
		this.scrollY = startYFrom;

		// x, y
		const [xLength, yLength] = [this.mazeMap.data.length, this.mazeMap.data[0].length];

		// Randomize scroll direction and speed
		const scrollXDistance = random(1, 7) * 80 * (startXFrom > (xLength / 2) * 80 ? -1 : 1);
		const scrollYDistance = random(1, 7) * 80 * (startYFrom > (yLength / 2) * 80 ? -1 : 1);

		// Start fade out
		new Tween(this)
			.to({ fadeOpacity: 0 }, 5000)
			.onComplete(() => {
				// Scroll in random directions
				new Tween(this)
					.to({ scrollX: scrollXDistance, scrollY: scrollYDistance }, 20000)
					.onComplete(() => {
						// Fade back in
						new Tween(this)
							.to({ fadeOpacity: 1 }, 5000)
							.onComplete(() => {
								this.playBg = true;
							})
							.start();
					})
					.start();
			})
			.start();
	}

	update() {
		if (this.playBg) {
			this.playBg = false;
			this.backgroundAnimation();
		}
	}

	render() {
		// The maze itself
		ctx.save();
		ctx.translate(this.scrollX, this.scrollY);
		this.mazeMap.draw();
		ctx.restore();

		// Black rectangle
		ctx.fillStyle = `rgba(0, 0, 0, ${this.fadeOpacity})`;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}

	remove() {}
}

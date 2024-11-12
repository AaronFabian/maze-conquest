export class SystemError extends Error {
	constructor(message: string) {
		super(message);
		Object.setPrototypeOf(this, SystemError.prototype); // Ensure prototype chain is correct
		this.name = 'SystemError';
	}

	print() {
		console.error(`HANDLED SYSTEM ERROR -> ${this.message}`);
		console.error(this.stack);
	}
}

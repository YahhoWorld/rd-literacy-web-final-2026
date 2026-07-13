class Command {
	constructor(mode, r, g, b, a, thickness, points) {
		this.mode = mode;
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
		this.thickness = thickness;
		this.points = points;

		console.log(mode, r, g, b, a, thickness, points)
	}

	play(img, w, h) {
		console.log(`play ${this.mode}`)
		switch (this.mode) {
			case PAINTMODE_STROKE_CIRCLE: {
				for (const [x, y] of this.points) {
					drawCircle(img, x, y, this.thickness, w, h, this.r, this.g, this.b, this.a);
				}
				return;
			}
			case PAINTMODE_STROKE_RECT: {
				for (const [x, y] of this.points) {
					drawRect(img, x, y, this.thickness, w, h, this.r, this.g, this.b, this.a);
				}
				return;
			}
		}
	}
}


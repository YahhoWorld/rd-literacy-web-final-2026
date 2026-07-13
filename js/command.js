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

	whToPos(w, h, width) {
		return (width * h + w) * 4;
	}

	drawCircle(img, cX, cY, r2, width) {
		const r = Math.floor((r2 + 1) / 2);
		const sqrR = r * r;
		for (let i = -r; i <= r; ++i) {
			for (let j = -r; j <= r; ++j) {
				if (i * i + j * j > sqrR) continue;
				const pos = this.whToPos(cX + i, cY + j, width);
				img[pos] = this.r;
				img[pos + 1] = this.g;
				img[pos + 2] = this.b;
				img[pos + 3] = this.a;
				console.log("p")
			}
		}
	}

	play(img, w, h) {
		console.log(`play ${this.mode}`)
		switch (this.mode) {
			case PAINTMODE_STROKE_CIRCLE: {
				for (const [x, y] of this.points) {
					// this.drawCircle(img, x, y, this.thickness, w);
					drawCircle(img,x,y,this.thickness,w,this.r,this.g,this.b,this.a);
				}
				return;
			}
			case PAINTMODE_STROKE_RECT: {
				for(const [x,y] of this.points){
				const ht=Math.floor(this.thickness/2);
				for (let i = x-ht; i <= x+ht; ++i) {
					// for (let j = y-ht; j <= y+ht; ++j) {
					// 	const pos = this.whToPos(i,j, w);
					// 	img[pos] = this.r;
					// 	img[pos + 1] = this.g;
					// 	img[pos + 2] = this.b;
					// 	img[pos + 3] = this.a;
					// }
					drawRect(img,x,y,this.thickness,w,this.r,this.g,this.b,this.a);
				}
			}
				return;
			}
		}
	}
}


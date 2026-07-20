
// let vwidth = 100;	// canvasエリア自体のサイズ
// let vheight = 100;

class Canvas {

	constructor(
		id, ctx/*CanvasContext2D*/, width, height, r = 0xff, g = 0xff, b = 0xff, a = 0xff
	) {
		// コンテキスト
		this.ctx = ctx;

		// サイズ
		this.width = width;	// 描画画像自体の内部サイズ
		this.height = height;
		this.vwidth = 0;	// 実際のcanvasのサイズ
		this.vheight = 0;
		// const [vx,vy]=getClientXY();
		// this.resizeCanvas(vx,vy);
		// this.scale = Math.floor(Math.min(vwidth / width, vheight / height));

		// 画像
		this.pixels = new Uint8ClampedArray(width * height * 4);	// r:i, g:i+1, b:i+2, a:i+3
		for (let i = 0; i < width * height; ++i) {
			this.pixels[4 * i] = r;
			this.pixels[4 * i + 1] = g;
			this.pixels[4 * i + 2] = b;
			this.pixels[4 * i + 3] = a;
		}
		this.imageData = new ImageData(this.pixels, width, height);
		this.guidePixels = new Uint8ClampedArray(width * height * 4);	// r:i, g:i+1, b:i+2, a:i+3
		this.guidePixels.fill(0xff);



		// 画像の処理用
		this.offCanvas = document.createElement("canvas");
		this.offCanvas.width = width;
		this.offCanvas.height = height;
		this.offCtx = this.offCanvas.getContext("2d");

		console.log(`canvas made with w:${width}, h:${height}`);

		this.id = id;
	}

	whToPos(w, h) {
		return (this.width * h + w) * 4;
	}

	containsOffset(x, y) {
		return 0 < x && x < this.width * this.scale
			&& 0 < y && y < this.height * this.scale;
	}

	offsetToLocal(x, y) {
		if (!this.containsOffset(x, y)) return [-1, -1];
		return [
			Math.floor(x / this.scale),
			Math.floor(y / this.scale)
		];
	}

	offsetToRealLocal(x, y) {
		if (!this.containsOffset(x, y)) return [-1, -1];
		return [
			x / this.scale,
			y / this.scale
		];
	}

	paint(w, h, r, g, b, a) {
		let pos = this.whToPos(w, h);
		if (pos < 0 || pos >= this.pixels.length) return;
		this.pixels[pos] = r;
		this.pixels[pos + 1] = g;
		this.pixels[pos + 2] = b;
		this.pixels[pos + 3] = a;
	}

	paintDirect(i, r, g, b, a) {
		this.pixels[i] = r;
		this.pixels[i + 1] = g;
		this.pixels[i + 2] = b;
		this.pixels[i + 3] = a;
	}

	getcolor(w, h) {
		let pos = this.whToPos(w, h);
		return [
			this.pixels[pos],
			this.pixels[pos + 1],
			this.pixels[pos + 2],
			this.pixels[pos + 3]
		];
	}

	showCanvas = () => {
		this.offCtx.clearRect(0, 0, this.width, this.height);

		const img = this.offCtx.createImageData(this.width, this.height);
		img.data.set(this.pixels);
		this.offCtx.putImageData(img, 0, 0);
		const gimg = this.offCtx.createImageData(this.width, this.height);
		gimg.data.set(this.guidePixels);
		// this.offCtx.putImageData(gimg,0,0);

		this.ctx.clearRect(0, 0, this.vwidth, this.vheight);
		this.ctx.imageSmoothingEnabled = false;
		this.ctx.drawImage(
			this.offCanvas,
			0, 0,
			this.width, this.height,
			0, 0,
			this.scale * this.width, this.scale * this.height
			// this.vwidth,this.vheight
		);
		console.log(`${this.vwidth}, ${this.vheight},${this.scale}`)

		console.log("showed full canvas");
	}

	updateRect = (minX, minY, maxX, maxY) => {
		const w = maxX - minX + 1;
		const h = maxY - minY + 1;

		this.offCtx.clearRect(minX, minY, maxX - minX + 1, maxY - minY + 1);
		this.imageData.data.set(this.pixels);	// ブラウザの仕様ズレ対策

		this.offCtx.putImageData(
			this.imageData,
			0,
			0,
			minX,
			minY,
			w,
			h
		);

		const [iminX, iminY, imaxX, imaxY] = [
			Math.floor(minX * this.scale),
			Math.floor(minY * this.scale),
			Math.ceil(maxX * this.scale),
			Math.ceil(maxY * this.scale),
		]
		this.ctx.imageSmoothingEnabled = false;
		this.ctx.clearRect(minX * this.scale, minY * this.scale, w * this.scale, h * this.scale);

		this.ctx.drawImage(
			this.offCanvas,
			minX,
			minY,
			w,
			h,
			minX * this.scale, minY * this.scale, w * this.scale, h * this.scale
			// iminX,iminY,imaxX-iminX+this.scale,imaxY-iminY+this.scale
		);
	}

	paintTest() {
		for (let y = 0; y < this.height; ++y) {
			for (let x = 0; x < this.width; ++x) {

				const r = Math.floor(x / (this.width - 1) * 255);
				const g = Math.floor(y / (this.height - 1) * 255);
				const b = 128;

				this.paint(x, y, r, g, b, 255);
			}
		}
		console.log("test painted");
	}

	resizeCanvas = (w, h) => {
		// パディングを考慮
		w-=10;h-=10;
		// ビューポートに収まる倍率を計算し、最低でも1倍(等倍)を保証した整数倍率に丸める
		const rawScale = Math.min(w / this.width, h / this.height);
		this.scale = Math.max(1, Math.floor(rawScale));

		// canvas要素のサイズは、確定した整数scaleから逆算する（ズレをなくす）
		const [vx, vy] = [this.width * this.scale, this.height * this.scale];

		const c = getCanvas(this.id).htmlcanv;
		c.style.width = `${vx}px`;
		c.style.height = `${vy}px`;
		c.width = vx * dpr;
		c.height = vy * dpr;
		c.style.touchAction = "none";
		this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

		this.vwidth = vx;
		this.vheight = vy;

		console.log(`${this.vwidth}, ${this.vheight}, scale:${this.scale}`);

		this.showCanvas();
	}
}
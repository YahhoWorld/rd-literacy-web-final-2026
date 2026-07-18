
// let vwidth = 100;	// canvasエリア自体のサイズ
// let vheight = 100;

class Canvas {

	constructor(
		id, ctx/*CanvasContext2D*/, width, height, vwidth, vheight,r=0xff,g=0xff,b=0xff,a=0xff
	) {
		// コンテキスト
		this.ctx = ctx;

		// サイズ
		this.width = width;	// 描画画像自体の内部サイズ
		this.height = height;
		this.vwidth = vwidth;		// 実際のcanvasのサイズ
		this.vheight = vheight;
		this.scale = Math.min(vwidth / width, vheight / height);

		// 画像
		this.pixels = new Uint8ClampedArray(width * height * 4);	// r:i, g:i+1, b:i+2, a:i+3
		for(let i=0;i<width*height;++i){
			this.pixels[4*i]=r;
			this.pixels[4*i+1]=g;
			this.pixels[4*i+2]=b;
			this.pixels[4*i+3]=a;
		}
		this.imageData=new ImageData(this.pixels,width,height);
		this.guidePixels = new Uint8ClampedArray(width * height * 4);	// r:i, g:i+1, b:i+2, a:i+3
		this.guidePixels.fill(0xff);



		// 画像の処理用
		this.offCanvas = document.createElement("canvas");
		this.offCanvas.width = width;
		this.offCanvas.height = height;
		this.offCtx = this.offCanvas.getContext("2d");

		// 背景
		this.background = "white";

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
		this.offCtx.fillStyle = this.background;
		this.offCtx.clearRect(0, 0, this.width, this.height);
		this.offCtx.fillRect(0, 0, this.width, this.height);

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
		);
		console.log("showed full canvas");
	}

	updateRect = (minX, minY, maxX, maxY) => {
		const w = maxX - minX + 1;
		const h = maxY - minY + 1;

		this.offCtx.putImageData(
			this.imageData,
			0,
			0,
			minX,
			minY,
			w,
			h
		);

		this.ctx.drawImage(
			this.offCanvas,
			minX,
			minY,
			w,
			h,

			minX * this.scale,
			minY * this.scale,
			w * this.scale,
			h * this.scale
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

	resizeCanvas(w, h) {
		this.vwidth = w;
		this.vheight = h;

		this.scale = Math.min(w / this.width, h / this.height);
	}
}
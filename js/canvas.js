
// let vwidth = 100;	// canvasエリア自体のサイズ
// let vheight = 100;

class Canvas {
	constructor(
		canvas,ctx/*CanvasContext2D*/, width, height,vwidth,vheight
	) {
		this.canvas=canvas;
		this.ctx = ctx;

		this.width = width;	// 描画画像自体の内部サイズ
		this.height = height;

		this.pixels = new Uint8ClampedArray(width * height * 4);	// r:i, g:i+1, b:i+2, a:i+3
		this.pixels.fill(0xff);

		this.background = "white";

		this.offCanvas = document.createElement("canvas");
		this.offCanvas.width = width;
		this.offCanvas.height = height;
		this.offCtx = this.offCanvas.getContext("2d");

		this.vwidth=vwidth;		// 実際のcanvasのサイズ
		this.vheight=vheight;

		this.scale=Math.min(vwidth/width,vheight/height);

		console.log(`canvas made with w:${width}, h:${height}`);
	}

	whToPos(w, h) {
		return (this.width * h + w) * 4;
	}

	containsOffset(x,y){
		return 0<x&x<this.width*this.scale
			&& 0<y&y<this.height*this.scale;
	}

	offsetToLocal(x,y){
		if(!this.containsOffset(x,y))return [-1,-1];
		return [
			Math.floor(x/this.scale),
			Math.floor(y/this.scale)
		];
	}

	paint(w, h, r, g, b, a) {
		let pos = this.whToPos(w, h);
		if(pos<0||pos>=this.pixels.length)return;
		this.pixels[pos] = r;
		this.pixels[pos + 1] = g;
		this.pixels[pos + 2] = b;
		this.pixels[pos + 3] = a;
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
		console.log("showing canvas...");
		this.offCtx.fillStyle = this.background;
		this.offCtx.fillRect(0, 0, this.width, this.height);

		const img = this.offCtx.createImageData(this.width, this.height);
		img.data.set(this.pixels);
		this.offCtx.putImageData(img, 0, 0);

		this.ctx.imageSmoothingEnabled = false;
		this.ctx.drawImage(
			this.offCanvas,
			0, 0,
			this.width, this.height,
			0, 0,
			this.scale*this.width, this.scale*this.height
		);

		// const [x, y] = [vwidth / this.width, vheight / this.height];
		// for (let i = 0; i < this.width; ++i) {
		// 	for (let j = 0; j < this.height; ++j) {
		// 		let col = this.getcolor(i, j);
		// 		this.ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${col[3]})`;
		// 		this.ctx.fillRect(x * i, y * j, x * (i + 1), y * (j + 1));
		// 	}
		// }
		console.log("showed");
	}

	paintTest() {
		console.log("painting test...");
		for (let y = 0; y < this.height; ++y) {
			for (let x = 0; x < this.width; ++x) {

				const r = Math.floor(x / (this.width - 1) * 255);
				const g = Math.floor(y / (this.height - 1) * 255);
				const b = 128;

				this.paint(x, y, r, g, b, 255);
			}
		}
		console.log("painted");
	}

	resizeCanvas(w,h){
		this.vwidth=w;
		this.vheight=h;

		this.scale=Math.min(w/this.width,h/this.height);
	}
}
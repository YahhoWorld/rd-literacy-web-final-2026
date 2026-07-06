class Painter {
	constructor() {
		this.canvas = null;
		this.brush = { r: 0, g: 0, b: 0, a: 255 };
		this.isDrawing = false;
	}

	set(canvas) {
		if (this.canvas) {
			this.canvas.canvas.removeEventListener("mousemove", this.mousemoveEventListener);
			this.canvas.canvas.removeEventListener("mousedown", this.mousedownEventListener);
			this.canvas.canvas.removeEventListener("mouseup", this.mouseupEventListener);
		}
		console.log(canvas);
		this.canvas = canvas;
		this.canvas.canvas.addEventListener("mousemove", this.mousemoveEventListener);
		this.canvas.canvas.addEventListener("mousedown", this.mousedownEventListener);
		this.canvas.canvas.addEventListener("mouseup", this.mouseupEventListener);

		this.isDrawing = false;
	}

	mouseupEventListener=(e)=> {
		this.isDrawing = false;
		console.log("brush up");
	}

	mousedownEventListener=(e)=> {
		this.isDrawing = true;
		console.log("brush down");
	}

	mousemoveEventListener=(e)=> {
		if(!this.isDrawing)return;
		const [x, y] = this.canvas.offsetToLocal(e.offsetX, e.offsetY);
		console.log(`x,y : ${x}, ${y}`)
		this.canvas.paint(x, y, this.brush.r, this.brush.g, this.brush.b, this.brush.a);
		this.canvas.showCanvas();
	}


}
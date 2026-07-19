class Painter {
	constructor(id) {
		// 初期化
		this.id = id;
		this.canvas = null;
		this.controller = null;

		// ペンの設定
		this.brush = { r: 0, g: 0, b: 0, a: 255 };
		this.thickness = 1;
		this.paintMode = PAINTMODE_STROKE_RECT;

		// ペンの状態
		this.isDrawing = false;
		this.pointerX = -1;	// 現在のペン位置 x
		this.pointerY = -1;	// 現在のペン位置 y

		// 履歴
		this.timeline = null;

		// 現在の操作
		this.cmd=null;

		// 初期化
		this.paintWays = new Map();
		this.paintWays.set(PAINTMODE_STROKE_RECT, {
			start: () => {
				this.startPaint();
				const [x,y]=this.canvas.offsetToRealLocal(this.pointerX,this.pointerY);
				const [minX,minY,maxX,maxY]=this.cmd.addPoint([x,y],this.canvas.pixels,this.canvas.width,this.canvas.height);
				// this.canvas.showCanvas();
				this.canvas.updateRect(minX,minY,maxX,maxY);
			},
			frame: () => {
				const [x,y]=this.canvas.offsetToRealLocal(this.pointerX,this.pointerY);
				const [minX,minY,maxX,maxY]=this.cmd.addPoint([x,y],this.canvas.pixels,this.canvas.width,this.canvas.height);
				this.canvas.updateRect(minX,minY,maxX,maxY);
			},
			end: () => this.commitCommand()
		});
		this.paintWays.set(PAINTMODE_STROKE_CIRCLE, {
			start: () => {
				this.startPaint();
				const [x,y]=this.canvas.offsetToRealLocal(this.pointerX,this.pointerY);
				const [minX,minY,maxX,maxY]=this.cmd.addPoint([x,y],this.canvas.pixels,this.canvas.width,this.canvas.height);
				this.canvas.updateRect(minX,minY,maxX,maxY);
			},
			frame: () => {
				const [x,y]=this.canvas.offsetToRealLocal(this.pointerX,this.pointerY);
				const [minX,minY,maxX,maxY]=this.cmd.addPoint([x,y],this.canvas.pixels,this.canvas.width,this.canvas.height);
				this.canvas.updateRect(minX,minY,maxX,maxY);
			},
			end: () => this.commitCommand()
		});
		this.paintWays.set(PAINTMODE_FILL_CIRCLE, {
			start: () => this.startPaint(),
			frame: () => null,
			end: () => null
		});
		this.paintWays.set(PAINTMODE_FILL_RECT, {
			start: () => this.startPaint(),
			frame: () => null,
			end: () => null
		});
		this.paintWays.set(PAINTMODE_FILL_COLOR, {
			start: () => this.startPaint(),
			frame: () => null,
			end: () => null
		});
	}

	commitCommand(){
		this.timeline.action(this.cmd);
		console.log(`paint end, dirty rect: ${this.cmd.bounds}`);
		this.cmd=null;
	}

	startPaint() {
		this.cmd=new Command(this.paintMode,this.brush.r,this.brush.g,this.brush.b,this.brush.a,this.thickness);
	}

	addAction() {
		this.timeline.action(new Command(
			this.paintMode,
			this.brush.r,
			this.brush.g,
			this.brush.b,
			this.brush.a,
			this.thickness,
			this.points
		));
	}

	getController() {
		let col = this.controller.querySelector(".color-input");
		this.brush.r = parseInt(col.value.slice(1, 3), 16);
		this.brush.g = parseInt(col.value.slice(3, 5), 16);
		this.brush.b = parseInt(col.value.slice(5, 7), 16);
		this.brush.a = parseInt(this.controller.querySelector(".a").value);
		const winput = this.controller.querySelector(".weight").value;
		this.thickness = Number(winput);
		this.paintMode=Number(this.controller.querySelector(`input[name='shape-${this.id}']:checked`).value);
		console.log(this.paintMode)
		const layerZ=Number(this.controller.querySelector(".layer-z").value);
		getCanvas(this.id).z=layerZ;
		console.log(`read contoller brush: ${this.brush}`);
	}

	set() {
		console.log(`setup painter - id:${this.id}`);
		let cn = getCanvas(this.id);
		let c = cn.htmlcanv;
		if (this.canvas) {
			c.removeEventListener("pointermove", this.mousemoveEventListener);
			c.removeEventListener("pointerdown", this.mousedownEventListener);
			c.removeEventListener("pointerup", this.mouseupEventListener);
		}
		c.addEventListener("pointermove", this.mousemoveEventListener);
		c.addEventListener("pointerdown", this.mousedownEventListener);
		c.addEventListener("pointerup", this.mouseupEventListener);
		c.addEventListener("mouseleave",this.mouseupEventListener);

		const fragment = document.getElementById("canvas-controller-template").content.cloneNode(true);
		fragment.querySelector("form").addEventListener("change", () => this.getController());
		fragment.querySelector(".undo-button").addEventListener("click", (e) => { e.preventDefault(); this.undo(); });
		fragment.querySelector(".redo-button").addEventListener("click", (e) => { e.preventDefault(); this.redo(); });
		fragment.querySelector(".go-next").addEventListener("click", (e) => { e.preventDefault(); window.scroll(0,window.scrollY+this.canvas.vheight+5); });
		fragment.querySelector(".go-previous").addEventListener("click", (e) => { e.preventDefault(); window.scroll(0,window.scrollY-this.canvas.vheight-5); });
		fragment.id=`ctrid-${this.id}`;
		fragment.querySelectorAll("input[name='shape']").forEach(element => {
			element.name=`shape-${this.id}`;
		});
		this.controller = fragment.querySelector(".canvas-controller");
		this.controller.querySelector(".layer-z").value=getCanvas(this.id).zIndex;
		changeDraggable(this.controller,this.controller.querySelector(".hover-bar"));
		cn.doc.appendChild(fragment);
		this.canvas = cn.canvas;

		this.timeline = new TimeLine(cn.canvas);

		this.isDrawing = false;
	}

	undo() {
		this.timeline.undo();
		const c = getCanvas(this.id).canvas;
		this.timeline.reload(c);
		c.showCanvas();
	}

	redo() {
		this.timeline.redo();
		const c = getCanvas(this.id).canvas;
		this.timeline.reload(c);
		c.showCanvas();
	}

	refreshCanvas(){
		const c = getCanvas(this.id).canvas;
		// TODO: コマンドの整理をここに書いた方が良いかも
		this.timeline.reload(c);
		c.showCanvas();
	}

	mouseupEventListener = (e) => {
		e.preventDefault();
		if (!this.isDrawing) return;
		this.isDrawing = false;
		console.log("brush up");
		this.pointerX = e.offsetX;
		this.pointerY = e.offsetY;
		this.paintWays.get(this.paintMode).end();
	}

	mousedownEventListener = (e) => {
		e.preventDefault();
		if (this.isDrawing) return;
		this.isDrawing = true;
		this.pointerX = e.offsetX;
		this.pointerY = e.offsetY;
		console.log("brush down");
		this.paintWays.get(this.paintMode).start();
	}

	mousemoveEventListener = (e) => {
		e.preventDefault();
		if (!this.isDrawing) return;
		this.pointerX = e.offsetX;
		this.pointerY = e.offsetY;
		this.paintWays.get(this.paintMode).frame();
	}

}
class Painter {
	constructor(id) {
		// 初期化
		this.id=id;
		this.canvas = null;
		this.controller=null;
		
		// ペンの設定
		this.brush = { r: 0, g: 0, b: 0, a: 255 };
		this.thickness=1;
		this.paintMode=PAINTMODE_STROKE_RECT;

		// ペンの状態
		this.isDrawing = false;
		this.pointerX=-1;	// 現在のペン位置 x
		this.pointerY=-1;	// 現在のペン位置 y

		// 履歴
		this.timeline=null;

		// 現在の操作
		this.points=[];	// ペンの動かした履歴など

		// 初期化
		this.paintWays=new Map();
		this.paintWays.set(PAINTMODE_STROKE_RECT,	{start:()=>this.startPaint(),frame:()=>this.savePoint(),end:()=>this.addAction()});
		this.paintWays.set(PAINTMODE_STROKE_CIRCLE,	{start:()=>this.startPaint(),frame:()=>this.savePoint(),end:()=>this.addAction()});
		this.paintWays.set(PAINTMODE_FILL_CIRCLE,	{start:()=>this.startPaint(),frame:()=>null,end:()=>null});
		this.paintWays.set(PAINTMODE_FILL_RECT,		{start:()=>this.startPaint(),frame:()=>null,end:()=>null});
		this.paintWays.set(PAINTMODE_FILL_COLOR,	{start:()=>this.startPaint(),frame:()=>null,end:()=>null});
	}

	startPaint(){
		this.points=[];
		this.points.push(this.canvas.offsetToLocal(this.pointerX,this.pointerY));
	}

	savePoint(){
		const [nowX,nowY]=this.canvas.offsetToLocal(this.pointerX,this.pointerY);
		const lastIdx=this.points.length-1;
		const [pX,pY]=this.points[lastIdx];
		if(nowX===pX&&nowY===pY){
			// 前と同じ点は保存しなくていい（よね）
			// データ圧縮用
			return;
		}
		this.points.push([nowX,nowY]);
	}

	addAction(){
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

	getController(){
		let col=this.controller.querySelector(".color-input");
		this.brush.r=parseInt(col.value.slice(1,3),16);
		this.brush.g=parseInt(col.value.slice(3,5),16);
		this.brush.b=parseInt(col.value.slice(5,7),16);
		this.brush.a=parseInt(this.controller.querySelector(".a").value);
		console.log(`read contoller brush: ${this.brush}`);
	}

	set() {
		let cn=getCanvas(this.id);
		console.log(cn);
		let c=cn.htmlcanv;
		if (this.canvas) {
			c.removeEventListener("pointermove", this.mousemoveEventListener);
			c.removeEventListener("pointerdown", this.mousedownEventListener);
			c.removeEventListener("pointerup", this.mouseupEventListener);
		}
		console.log(c);
		// c.addEventListener("mousemove", this.mousemoveEventListener);
		// c.addEventListener("mousedown", this.mousedownEventListener);
		// c.addEventListener("mouseup", this.mouseupEventListener);
		c.addEventListener("pointermove", this.mousemoveEventListener);
		c.addEventListener("pointerdown", this.mousedownEventListener);
		c.addEventListener("pointerup", this.mouseupEventListener);

		const fragment=document.getElementById("canvas-controller-template").content.cloneNode(true);
		fragment.querySelector("form").addEventListener("change",()=>this.getController());
		this.controller=fragment.querySelector(".canvas-controller");
		cn.doc.appendChild(fragment);
		this.canvas = cn.canvas;

		this.timeline=new TimeLine(cn.canvas);

		this.isDrawing = false;
	}

	undo(){
		this.timeline.undo();
		const c=getCanvas(this.id).canvas;
		this.timeline.reload(c);
		c.showCanvas();
	}

	redo(){
		this.timeline.redo();
		const c=getCanvas(this.id).canvas;
		this.timeline.reload(c);
		c.showCanvas();
	}

	mouseupEventListener = (e) => {
		e.preventDefault();
		if(!this.isDrawing)return;
		this.isDrawing = false;
		console.log("brush up");
		this.pointerX=e.offsetX;
		this.pointerY=e.offsetY;
		this.paintWays.get(this.paintMode).end();
	}

	mousedownEventListener = (e) => {
		e.preventDefault();
		if (this.isDrawing) return;
		this.isDrawing = true;
		this.pointerX=e.offsetX;
		this.pointerY=e.offsetY;
		this.paintAtPointer();
		console.log("brush down");
		this.paintWays.get(this.paintMode).start();
	}
	
	mousemoveEventListener = (e) => {
		e.preventDefault();
		if (!this.isDrawing) return;
		this.pointerX=e.offsetX;
		this.pointerY=e.offsetY;
		this.paintAtPointer();
		this.paintWays.get(this.paintMode).frame();
	}

	paintAtPointer(){
		const [x, y] = this.canvas.offsetToLocal(this.pointerX, this.pointerY);
		console.log(`x,y : ${x}, ${y}`);
		this.paint(x, y, this.brush.r, this.brush.g, this.brush.b, this.brush.a);
		this.canvas.showCanvas();
	}

	paint(x, y, r, g, b, a) {
		this.canvas.paint(x, y, r, g, b, a);
	}


}
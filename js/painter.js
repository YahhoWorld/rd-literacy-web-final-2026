class Painter {
	constructor(id) {
		this.canvas = null;
		this.brush = { r: 0, g: 0, b: 0, a: 255 };
		this.isDrawing = false;

		this.pointerX=-1;
		this.pointerY=-1;

		this.controller=null;

		this.id=id;
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

		this.isDrawing = false;
	}

	mouseupEventListener = (e) => {
		e.preventDefault();
		this.isDrawing = false;
		console.log("brush up");
		this.pointerX=e.offsetX;
		this.pointerY=e.offsetY;
	}

	mousedownEventListener = (e) => {
		e.preventDefault();
		this.isDrawing = true;
		this.pointerX=e.offsetX;
		this.pointerY=e.offsetY;
		this.paintAtPointer();
		console.log("brush down");
	}

	mousemoveEventListener = (e) => {
		e.preventDefault();
		if (!this.isDrawing) return;
		this.pointerX=e.offsetX;
		this.pointerY=e.offsetY;
		this.paintAtPointer();
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
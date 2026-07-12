const canvasArea = document.getElementById("canvas");

const canvases = {};

let clwidth = window.innerWidth;		// クライアントエリアのサイズ
let clheight = window.innerHeight;

const getClientXY = () => [
	window.innerWidth,
	window.innerHeight
];

let canvasCount = 0;
let nextId = 0;

const getCanvas = (id) => {
	return canvases[id];
}

const createCanvas = (w, h) => {
	console.log("create canvas");
	const c = document.createElement("canvas");
	c.id = `canv${canvasCount++}`;

	const ctx = c.getContext("2d");
	const dpr = window.devicePixelRatio || 1;
	const [cx, cy] = getClientXY();
	const scale=Math.min(cx/w,cy/h);
	const [vx,vy]=[scale*w,scale*h];
	c.style.width = `${vx}px`;
	c.style.height = `${vy}px`;
	c.width = vx * dpr;
	c.height = vy * dpr;
	c.style.touchAction="none";
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

	let id = nextId++;
	let cvs = new Canvas(id, ctx, w, h, vx, vy);
	let ptr = new Painter(id);
	let tar = document.createElement("div");
	tar.classList.add("canvas");

	tar.appendChild(c);
	canvasArea.appendChild(tar);

	canvases[id] =
	{
		canvas: cvs,
		painter: ptr,
		doc: tar,
		htmlcanv:c
	};
	cvs.paintTest();
	ptr.set();
	cvs.showCanvas();

	console.log(canvases)
}

const debugundo=()=>{
	canvases[0].painter.undo();
}
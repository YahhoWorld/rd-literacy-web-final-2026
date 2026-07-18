const canvasArea = document.getElementById("canvas");

const canvases = {};
const canvasIds=[];

const canvasMakeEventListeners=[];

let clwidth = window.innerWidth;		// クライアントエリアのサイズ
let clheight = window.innerHeight;

let width=null;
let height=null;

let isFirstTime=true;

const getClientXY = () => [
	window.innerWidth,
	window.innerHeight
];

let canvasCount = 0;
let nextId = 0;

const getCanvas = (id) => {
	return canvases[id];
}

const createCanvas = (w, h,option) => {
	if(isFirstTime){
	width=w;
	height=h;
	}
	console.log("create canvas");
	const c = document.createElement("canvas");
	c.id = `canv${canvasCount++}`;

	const ctx = c.getContext("2d");
	const dpr = window.devicePixelRatio || 1;
	const [cx, cy] = getClientXY();
	const scale=Math.min(cx/width,cy/height);
	const [vx,vy]=[scale*width-10,scale*height-10];
	c.style.width = `${vx}px`;
	c.style.height = `${vy}px`;
	c.width = vx * dpr;
	c.height = vy * dpr;
	c.style.touchAction="none";
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

	let id = nextId++;
	let cvs = new Canvas(id, ctx, width, height, vx, vy,
		option==="w"||option==="t"?0xff:0x0,
		option==="w"||option==="t"||option==="gb"?0xff:0x0,
		option==="w"||option==="t"?0xff:0x0,
		option==="t"?0x0:0xff,
	);
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
		htmlcanv:c,
		zIndex:canvasIds.length,
	};
	// cvs.paintTest();
	ptr.set();
	cvs.showCanvas();
	canvasIds.push(id);

	console.log(canvases);

	for(f of canvasMakeEventListeners)f();
}

const debugundo=()=>{
	canvases[0].painter.undo();
}

const debugredo=()=>{
	canvases[0].painter.redo();
}
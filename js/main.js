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
	c.style.width = `${cx}px`;
	c.style.height = `${cy}px`;
	c.width = cx * dpr;
	c.height = cy * dpr;
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

	let id = nextId++;
	let cvs = new Canvas(id, ctx, w, h, cx, cy);
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
	ptr.set();
	cvs.paintTest();
	cvs.showCanvas();

	console.log(canvases)
}
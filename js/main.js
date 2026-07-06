const canvasArea=document.getElementById("canvas");

const canvases=[];

let clwidth=window.innerWidth;		// クライアントエリアのサイズ
let clheight=window.innerHeight;

const getClientXY=()=>[
	window.innerWidth,
	window.innerHeight
];

let canvasCount=0;

const createCanvas=(w,h)=>{
	console.log("create canvas");
	const c=document.createElement("canvas");
	c.id=`canv${canvasCount++}`;
	canvasArea.appendChild(c);

	const ctx=c.getContext("2d");
	const dpr = window.devicePixelRatio || 1;
	const [cx,cy]=getClientXY();
	c.style.width=`${cx}px`;
	c.style.height=`${cy}px`;
	c.width=cx*dpr;
	c.height=cy*dpr;
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);



	let cvs=new Canvas(c,ctx,w,h,cx,cy);
	let ptr=new Painter();
	ptr.set(cvs);
	canvases.push({canvas:cvs,painter:ptr});
	cvs.paintTest();
	cvs.showCanvas();
}
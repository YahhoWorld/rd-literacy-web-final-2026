const whToPos = (w, h, width) => {
	return (width * h + w) * 4;
}

const containsPos=(w,h,x,y)=>0<=x&&x<w && 0<=y&&y<h;

const getMinMax=(minX,minY,maxX,maxY,width,height)=>{
	return [minX<0?0:minX,minY<0?0:minY,maxX>width?width:maxX,maxY>height?height:maxY];
}

const drawCircle = (img, cX, cY, r2, width,height, r, g, b, a) => {
	const r1 = Math.floor((r2 + 1) / 2);
	const sqrR = r1 * r1;
	const [minX,minY,maxX,maxY]=getMinMax(cX-r1,cY-r1,cX+r1,cY+r1,width,height);
	for (let i = minX; i <= maxX; ++i) {
		for (let j = minY; j <= maxY; ++j) {
			if (i * i + j * j > sqrR) continue;
			// if(!containsPos(width,height,i,j))continue;
			const pos = whToPos(i, j, width);
			img[pos] = r;
			img[pos + 1] = g;
			img[pos + 2] = b;
			img[pos + 3] = a;
		}
	}
	return [minX,minY,maxX,maxY];
}

const drawRect = (img, x, y, thickness, width,height, r, g, b, a) => {
	const ht = thickness / 2;
	const [cX,cY]=thickness%2===1?[Math.round(x-0.5),Math.round(y-0.5)]:[Math.round(x),Math.round(y)];
	const start =-Math.floor(ht);
	const end=start+thickness;
	const [minX,minY,maxX,maxY]=getMinMax(cX + start,cY + start,cX + end,cY + end,width,height);
	for (let i = minX; i < maxX; ++i) {
		for (let j = minY; j < maxY; ++j) {
			// if(!containsPos(width,height,i,j))continue;
			const pos = whToPos(i, j, width);
			img[pos] = r;
			img[pos + 1] = g;
			img[pos + 2] = b;
			img[pos + 3] = a;
		}
	}
	return [minX,minY,maxX,maxY];
}
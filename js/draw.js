const whToPos = (w, h, width) => {
	return (width * h + w) * 4;
}

const containsPos=(w,h,x,y)=>0<=x&&x<w && 0<=y&&y<h;

const drawCircle = (img, cX, cY, r2, width,height, r, g, b, a) => {
	const r1 = Math.floor((r2 + 1) / 2);
	const sqrR = r1 * r1;
	for (let i = -r1; i <= r1; ++i) {
		for (let j = -r1; j <= r1; ++j) {
			if (i * i + j * j > sqrR) continue;
			if(!containsPos(width,height,i,j))continue;
			const pos = whToPos(cX + i, cY + j, width);
			img[pos] = r;
			img[pos + 1] = g;
			img[pos + 2] = b;
			img[pos + 3] = a;
		}
	}
}

const drawRect = (img, x, y, thickness, width,height, r, g, b, a) => {
	const ht = thickness / 2;
	const [cX,cY]=thickness%2===1?[Math.round(x-0.5),Math.round(y-0.5)]:[Math.round(x),Math.round(y)];
	const start =-Math.floor(ht);
	const end=start+thickness;
	for (let i = cX + start; i < cX + end; ++i) {
		for (let j = cY + start; j < cY + end; ++j) {
			if(!containsPos(width,height,i,j))continue;
			const pos = whToPos(i, j, width);
			img[pos] = r;
			img[pos + 1] = g;
			img[pos + 2] = b;
			img[pos + 3] = a;
		}
	}
}
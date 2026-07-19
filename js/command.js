class Command {
	constructor(mode, r, g, b, a, thickness) {
		this.mode = mode;
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
		this.thickness = thickness;
		this.points = [];

		this.bounds=[-1,-1,-1,-1];

		console.log(`${mode}, ${r}, ${g}, ${b}, ${a}, ${thickness}`);
	}

	addPoint(point,img,w,h){
		let [minX,minY,maxX,maxY]=[0,0,0,0];
		this.points.push(point);
		const [x,y]=point;
		switch(this.mode){
			case PAINTMODE_STROKE_CIRCLE:{
				console.log("c");
				[minX,minY,maxX,maxY]=drawCircle(img, x, y, this.thickness, w, h, this.r, this.g, this.b, this.a);
				break;
			}
			case PAINTMODE_STROKE_RECT:{
				[minX,minY,maxX,maxY]=drawRect(img, x, y, this.thickness, w, h, this.r, this.g, this.b, this.a);
				break;
			}
		}
		this.updateBounds(minX,minY,maxX,maxY);
		return [minX,minY,maxX,maxY];
	}

	play(img, w, h) {
		console.log(`play ${this.mode}, ${this.points.length} points`);
		switch (this.mode) {
			case PAINTMODE_STROKE_CIRCLE: {
				for (const [x, y] of this.points) {
					drawCircle(img, x, y, this.thickness, w, h, this.r, this.g, this.b, this.a);
				}
				return;
			}
			case PAINTMODE_STROKE_RECT: {
				for (const [x, y] of this.points) {
					drawRect(img, x, y, this.thickness, w, h, this.r, this.g, this.b, this.a);
				}
				return;
			}
		}
	}

	updateBounds(minX,minY,maxX,maxY){
		const [currentMinX,currentMinY,currentMaxX,currentMaxY]=this.bounds;
		if(currentMaxX===-1){
			this.bounds=[minX,minY,maxX,maxY];
			return;
		}
		this.bounds=[
			currentMinX>minX?minX:currentMinX,
			currentMinY>minY?minY:currentMinY,
			currentMaxX<maxX?maxX:currentMaxX,
			currentMaxY<maxY?maxY:currentMaxY
		];
	}
}


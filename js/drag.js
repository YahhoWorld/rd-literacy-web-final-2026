const changeDraggable = (element, control) => {
	let offsetX, offsetY;
	let dragging = false;
	const getSizeX=()=> element.clientWidth;
	const getSizeY=()=>element.clientHeight;

	element.classList.add("draggable");

	control.addEventListener("pointerdown", e => {
		dragging = true;
		offsetX = e.clientX - element.offsetLeft;
		offsetY = e.clientY - element.offsetTop;
		control.setPointerCapture(e.pointerId);
	});

	control.addEventListener("pointermove", e => {
		if (!dragging) return;
		let [x,y]=[e.clientX - offsetX,e.clientY - offsetY];
		[x,y]=[
			x<0?0:(x>window.innerWidth- getSizeX()?window.innerWidth- getSizeX():x),
			y<0?0:(y>window.innerHeight- getSizeY()?window.innerHeight- getSizeY():y)
		];

		element.style.left = `${x}px`;
		element.style.top = `${y}px`;
	});

	const endDrag = e => {
		dragging = false;
		control.releasePointerCapture(e.pointerId);
	};

	control.addEventListener("pointerup", endDrag);
	control.addEventListener("pointercancel", endDrag);
};
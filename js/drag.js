const changeDraggable = (element, control) => {
	let offsetX, offsetY;
	let dragging = false;

	element.classList.add("draggable");

	control.addEventListener("pointerdown", e => {
		dragging = true;
		offsetX = e.clientX - element.offsetLeft;
		offsetY = e.clientY - element.offsetTop;
		control.setPointerCapture(e.pointerId);
	});

	control.addEventListener("pointermove", e => {
		if (!dragging) return;

		element.style.left = `${e.clientX - offsetX}px`;
		element.style.top = `${e.clientY - offsetY}px`;
	});

	const endDrag = e => {
		dragging = false;
		control.releasePointerCapture(e.pointerId);
	};

	control.addEventListener("pointerup", endDrag);
	control.addEventListener("pointercancel", endDrag);
};
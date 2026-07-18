const makePng = () => {
	let sourceImgs = [];
	canvasIds.forEach((id) => {
		sourceImgs.push(getCanvas(id));
	})
	sourceImgs = sourceImgs.sort((a, b) => a.zIndex - b.zIndex);
	sourceImgs.forEach(c => {
		c.painter.refreshCanvas();
	});

	const out = document.createElement("canvas");
	out.width = sourceImgs[0].w;
	out.height = sourceImgs[0].h;
	const ctx = out.getContext("2d");
	sourceImgs.forEach((c) => {
		ctx.drawImage(c.htmlcanv, 0, 0);
	});

	return new Promise((resolve, reject) => {
		out.toBlob(blob => {
			console.log(blob);
			if(blob)resolve(blob);
			else reject(new Error("Blobの生成に失敗しました。"));
		}, "image/png")
	});

}
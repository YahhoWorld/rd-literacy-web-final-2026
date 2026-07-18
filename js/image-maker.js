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
	out.width = width;
	out.height = height;
	console.log(`img: ${width},${height}`)
	const ctx = out.getContext("2d");
	sourceImgs.forEach((c) => {
		console.log(`draw ${c}`);
		ctx.drawImage(c.canvas.offCanvas, 0, 0);
	});
	// document.querySelector("body").appendChild(out);

	return new Promise((resolve, reject) => {
		out.toBlob(blob => {
			console.log(blob);
			if(blob)resolve(blob);
			else {
				console.log("blob failed");
				reject(new Error("Blobの生成に失敗しました。"));
			}
		}, "image/png")
	});

}

document.getElementById("download-png").addEventListener("click",async ()=>{
	const png=await makePng();
	const a = document.createElement("a");
    a.href = URL.createObjectURL(png);
    a.download = "image.png";
    a.click();
	setTimeout(()=>URL.revokeObjectURL(a.href),1000);
    
});
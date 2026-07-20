class TimeLine {
	constructor(canvas) {
		this.saveActionLimit = 50;	// test undoは10回まで
		this.snapshotInterval = 10;	// test 5操作おきにスナップショット

		this.actions = [];	// コマンド列
		this.now = 0;			// 今のコマンドが何番目か
		this.removedActions = 0;	// actionsから削除したコマンド数
		this.newest = 0;

		this.snapshots = [new Uint8ClampedArray(canvas.pixels.length)];
		for (let i = 0; i < canvas.pixels.length; ++i) {
			this.snapshots[0][i] = canvas.pixels[i];
		}
		this.snapshotTimes = [0];
		this.lastSnaped = 0;
		this.snapshotRects = [[0, 0, canvas.width, canvas.height]];	// array([minX,minY,maxX,maxY])

		this.w = canvas.width;
		this.h = canvas.height;
	}

	getActionIdx(time) {
		return time - this.removedActions;
	}
	getSnapshot(time) {
		return this.snapshots[this.snapshotTimes.indexOf(time)];
	}
	getAction(time) {
		return this.actions[time - this.removedActions];
	}

	load(img,time=this.now) {
		console.log(`load img`);
		let loadedSnapShotTime=0;
		for (let i = 0; i < this.snapshots.length; ++i) {
			if(this.snapshotTimes[i]<=time){
				loadedSnapShotTime=this.snapshotTimes[i];
			}
			else break;
			const [x0, y0, x1, y1] = this.snapshotRects[i];
			const sw = x1 - x0;
			const sh = y1 - y0;
			const s = this.snapshots[i];
			for (let x = 0; x < sw; ++x) {
				for (let y = 0; y < sh; ++y) {
					let si = whToPos(x, y, sw);
					let ii = whToPos(x0 + x, y0 + y, this.w);
					img[ii] = s[si];
					img[ii + 1] = s[si + 1];
					img[ii + 2] = s[si + 2];
					img[ii + 3] = s[si + 3];
				}
			}
		}
		// コマンドの実行
		for (let i = this.getActionIdx(loadedSnapShotTime); i < this.getActionIdx(time); ++i) {
			this.actions[i].play(img, this.w, this.h);
		}
		console.log(`replayed ${this.now-this.getActionIdx(this.lastSnaped)} commands`);
	}

	reload = (canvas) => this.load(canvas.pixels);

	snap() {
		console.log(`snap ${this.now} using ${this.lastSnaped}`);
		// 変更領域確定
		const dirtyRects = [];
		for (let i = this.getActionIdx(this.lastSnaped); i < this.getActionIdx(this.now); ++i) {
			dirtyRects.push(this.actions[i].bounds);
		}
		const [x0, y0, x1, y1] = this.unionRect(dirtyRects);
		const sw = x1 - x0, sh = y1 - y0;

		console.log(`snap area: ${x0},${y0},${x1},${y1}`);

		// スナップショットのロード（現在はloadを流用しているが、メモリ・処理効率的にはもとから変更領域分のみ処理するほうが良い）
		const size = this.snapshots[0].length;
		let full = new Uint8ClampedArray(size);
		this.load(full);

		// 変更範囲だけを切り出す（loadを流用しているため）
		const patch = new Uint8ClampedArray(sw * sh * 4);
		for (let x = 0; x < sw; ++x) {
			for (let y = 0; y < sh; ++y) {
				const si = whToPos(x, y, sw);
				const fi = whToPos(x0 + x, y0 + y, this.w);
				patch[si] = full[fi];
				patch[si + 1] = full[fi + 1];
				patch[si + 2] = full[fi + 2];
				patch[si + 3] = full[fi + 3];
			}
		}

		// スナップショット追加
		this.snapshots.push(patch);
		this.snapshotTimes.push(this.now);
		this.lastSnaped = this.now;
		this.snapshotRects.push(this.unionRect(dirtyRects));
		console.log(`snaped, ${this.snapshots.length} snapshots`);
	}

	action(cmd) {
		this.actions[this.getActionIdx(this.now)] = cmd;	// jsは配列の長さが自動拡張される(はず)
		this.now++;
		this.newest = this.now;
		if (this.now - this.lastSnaped >= this.snapshotInterval) {
			this.snap();
		}
		if (this.actions.length > this.saveActionLimit) {
			// スナップショットを進めて履歴削除
			const newOriginSnap=new Uint8ClampedArray(this.w*this.h*4);
			this.load(newOriginSnap,this.snapshotTimes[0]+1);
			if(this.snapshotTimes[0]+1===this.snapshotTimes[1]){
				// スナップショットの削除
				this.snapshots.splice(1,1);
				this.snapshotRects.splice(1,1);
				this.snapshotTimes.splice(1,1);
			}
			this.snapshots[0]=newOriginSnap;
			this.snapshotTimes[0]=this.snapshotTimes[0]+1;

			this.actions.shift();
			this.removedActions++;
		}
	}

	undo() {
		console.log("undo");
		if (this.now <= this.removedActions) return;
		this.now--;
		if (this.lastSnaped > this.now) {
			console.log("pop snapshot");
			this.snapshots.pop();
			this.snapshotTimes.pop();
			this.snapshotRects.pop();
			this.lastSnaped = this.snapshotTimes[this.snapshotTimes.length - 1]
		}
	}

	redo() {
		console.log("redo");
		if (this.newest > this.now) this.now++;
	}

	unionRect(rects) {
		let [minX, minY, maxX, maxY] = rects[0];
		for (let i = 1; i < rects.length; ++i) {
			const [x0, y0, x1, y1] = rects[i];
			[minX, minY, maxX, maxY] = [
				minX > x0 ? x0 : minX,
				minY > y0 ? y0 : minY,
				maxX < x1 ? x1 : maxX,
				maxY < y1 ? y1 : maxY,
			]
		}
		return [minX, minY, maxX, maxY];
	}
}
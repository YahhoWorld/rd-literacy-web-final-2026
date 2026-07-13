class TimeLine{
	constructor(canvas){
		this.saveActionLimit=10;	// test undoは10回まで
		this.snapshotInterval=5;	// test 5操作おきにスナップショット

		this.actions=[];	// コマンド列
		this.now=0;			// 今のコマンドが何番目か
		this.removedActions=0;	// actionsから削除したコマンド数
		this.newest=0;
		
		this.snapshots=[new Uint8ClampedArray(canvas.pixels.length)];
		for(let i=0;i<canvas.pixels.length;++i){
			this.snapshots[0][i]=canvas.pixels[i];
		}
		this.snapshotTimes=[0];
		this.lastSnaped=0;

		this.w=canvas.width;
		this.h=canvas.height;
	}

	getActionIdx(time){
		return time-this.removedActions;
	}
	getSnapshot(time){
		return this.snapshots[this.snapshotTimes.indexOf(time)];
	}
	getAction(time){
		return this.actions[time-this.removedActions];
	}

	load(canvas,when){
		console.log(`load at ${when}`);
		// 近いスナップショットの探索
		let time=0;	// スナップショット番号
		for(let i=this.snapshotTimes.length-1;i>=0;--i){
			if(this.snapshotTimes[i]<when){
				time=this.snapshotTimes[i];
				break;
			}
		}
		console.log(`near by ${time} snapshot`);
		// スナップショットのロード
		const s=this.getSnapshot(time);
		console.log(`loaded snapshot at ${time}`);
		for(let i=0;i<s.length;++i){
			canvas.pixels[i]=s[i];
		}
		// コマンドの実行
		for(let i=this.getActionIdx(time);i<when;++i){
			this.getAction(i).play(canvas.pixels,canvas.width,canvas.height);
		}
		console.log(`replayed ${when-this.getActionIdx(time)} commands`);
	}

	reload=(canvas)=>this.load(canvas,this.now);

	snap(){
		console.log(`snap ${this.now} using ${this.lastSnaped}`);
		// スナップショットのロード
		const s=this.getSnapshot(this.lastSnaped);
		let tar=new Uint8ClampedArray(s.length);
		for(let i=0;i<s.length;++i){
			tar[i]=s[i];
		}
		// コマンドの実行
		for(let i=this.getActionIdx(this.lastSnaped);i<this.now;++i){
			this.getAction(i).play(tar,this.w,this.h);
		}
		// スナップショット追加
		this.snapshots.push(tar);
		this.snapshotTimes.push(this.now);
		this.lastSnaped=this.now;
		console.log(`snaped, all snapshot is ${this.snapshots.length}`);
	}

	action(cmd){
		this.actions[this.getActionIdx(this.now)]=cmd;	// jsは配列の長さが自動拡張される(はず)
		this.now++;
		this.newest=this.now;
		if(this.now-this.lastSnaped>=this.snapshotInterval){
			this.snap();
		}
		if(this.actions.length>this.saveActionLimit){
			// スナップショットを進めて履歴削除
			
		}
	}

	undo(){
		console.log("undo");
		if(this.now==0)return;
		this.now--;
		if(this.lastSnaped>this.now){
			this.snapshots.pop();
			this.snapshotTimes.pop();
			this.lastSnaped=this.snapshotTimes[this.snapshotTimes.length-1]
		}
	}

	redo(){
		if(this.newest>this.now)this.now++;
	}
}
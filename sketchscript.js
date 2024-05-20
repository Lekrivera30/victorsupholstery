//application functions
const getMousePosition = (canvas, event) => {
	const rect = canvas.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;
	return [x, y];
}
class Line{
	constructor(x, y, lineWidth, lineColor){
		this.startPos = [x, y];
		this.endPos;
		this.dragPath = [this.startPos];
		this.lineColor = lineColor;
		this.lineWidth = lineWidth;
	}
	addToDragPath(x, y){
		this.dragPath.push([x, y]);
	}
	drawLine(ctx, fromX, fromY, toX, toY){
		//save initial ctx attrs
		const initColor = getCurrentColor(ctx);
		const initWidth = getCurrentWidth(ctx);
		//set ctx attrs to this attrs
		changeColor(ctx, this.lineColor);
		changeWidth(ctx, this.lineWidth);
		//draw line
		ctx.beginPath();
		ctx.moveTo(fromX, fromY);
		ctx.lineTo(toX, toY);
		ctx.stroke();
		//reset to init ctx attrs
		//set ctx attrs to this attrs
		changeColor(ctx, this.lineColor);
		changeWidth(ctx, this.lineWidth);
	}
	redrawLine(ctx){
		let tail = this.dragPath.length;
		while(tail -2 >= 0){
			const [fromX, fromY] = this.dragPath[tail-1];
			const [toX, toY] = this.dragPath[tail-2];
			this.drawLine(ctx, fromX, fromY, toX, toY);
			tail--;
		}
	}	
	toString(){
		return `Line with startPos = ${this.startPos}`;
	}
}

const addLocToPathAndDraw = (ctx, curLine, x, y) =>{
	curLine.addToDragPath(x, y);
		const dragpath = curLine.dragPath;
		if (dragpath.length >= 2){
			const [fromX, fromY] = dragpath[dragpath.length -1];
			const [toX, toY] = dragpath[dragpath.length -2];
			curLine.drawLine(ctx, fromX, fromY, toX, toY);
		}
}

const clearCanvas = (ctx, canvas) =>{
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

const changeColor = (ctx, newColor) =>{
	//implement this
	ctx.strokeStyle = newColor;
}

const changeWidth = (ctx, newWidth) =>{
	ctx.lineWidth = newWidth;
}

const getCurrentColor = (ctx) =>{
	return ctx.strokeStyle;
}

const getCurrentWidth = (ctx) =>{
	return ctx.lineWidth;
}

//main function
window.onload = () => {
	//elements
	const canvas = document.querySelector("#canvas");
	const colorPicker = document.querySelector("#color-picker");
	const pencilWidth = document.querySelector("#pencil-width");
	const undoButton = document.querySelector("#undo");
	const clearButton = document.querySelector("#clear");
	
	//canvas configurations
	const ctx = canvas.getContext('2d');
	
	//variables
	let curLine;
	const lines = [];
	
	//event listeners
	canvas.addEventListener("mousedown", (event)=>{
		if(curLine){
			return;
		}
		const [x, y] = getMousePosition(canvas, event);
		curLine = new Line(x, y, getCurrentWidth(ctx), getCurrentColor(ctx));
		lines.push(curLine);
	});
	
	canvas.addEventListener("mousemove", (event) =>{
		if(!curLine){
			return;
		}
		//user is currently drawing
		const [x, y] = getMousePosition(canvas, event);
		addLocToPathAndDraw(ctx, curLine, x, y);	
	});
	
	canvas.addEventListener("mouseup", (event)=>{
		const [x, y] = getMousePosition(canvas, event);
		addLocToPathAndDraw(ctx, curLine, x, y);
		curLine.endPos = [x, y];
		//reinit curLine var
		curLine = null;
	});
	
	clearButton.addEventListener("click", ()=> {
		clearCanvas(ctx, canvas);
		curLine = null; 
	});
	
	colorPicker.addEventListener("change", ()=>{
		changeColor(ctx, colorPicker.value);
		curLine = null;
	});
	
	pencilWidth.addEventListener("change", ()=>{
		changeWidth(ctx, parseInt(pencilWidth.value));
	});
	
	undoButton.addEventListener("click", ()=>{
		if(lines.length > 0) {
			lines.pop();
			clearCanvas(ctx, canvas);
			lines.forEach(line => line.redrawLine(ctx));
		}
	})
	
}
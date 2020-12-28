"use strict";
var //canvas element
	canvas=document.getElementById("ourCanvas"),
	//canvas context
	ctx=canvas.getContext("2d"),
	//window and canvas dimensions
	WH=0,WW=0,CW=0,CH=0,
	//state of the background(used for B0 rules)
	base=0,
	//the code for decoding rule strings.
    ruleMap=[[0,"-"],[1,"c"],[1,"e"],[2,"a"],[1,"c"],[2,"c"],[2,"a"],[3,"i"],[1,"e"],[2,"k"]//00
            ,[2,"e"],[3,"j"],[2,"a"],[3,"n"],[3,"a"],[4,"a"],[1,"c"],[2,"n"],[2,"k"],[3,"q"]//10
            ,[2,"c"],[3,"c"],[3,"n"],[4,"n"],[2,"a"],[3,"q"],[3,"j"],[4,"w"],[3,"i"],[4,"n"]//20
            ,[4,"a"],[5,"a"],[1,"e"],[2,"k"],[2,"i"],[3,"r"],[2,"k"],[3,"y"],[3,"r"],[4,"t"]//30
            ,[2,"e"],[3,"k"],[3,"e"],[4,"j"],[3,"j"],[4,"k"],[4,"r"],[5,"n"],[2,"a"],[3,"q"]//40
            ,[3,"r"],[4,"z"],[3,"n"],[4,"y"],[4,"i"],[5,"r"],[3,"a"],[4,"q"],[4,"r"],[5,"q"]//50
            ,[4,"a"],[5,"j"],[5,"i"],[6,"a"],[1,"c"],[2,"c"],[2,"k"],[3,"n"],[2,"n"],[3,"c"]//60
            ,[3,"q"],[4,"n"],[2,"k"],[3,"y"],[3,"k"],[4,"k"],[3,"q"],[4,"y"],[4,"q"],[5,"j"]//70
            ,[2,"c"],[3,"c"],[3,"y"],[4,"y"],[3,"c"],[4,"c"],[4,"y"],[5,"e"],[3,"n"],[4,"y"]//80
            ,[4,"k"],[5,"k"],[4,"n"],[5,"e"],[5,"j"],[6,"e"],[2,"a"],[3,"n"],[3,"r"],[4,"i"]//90
            ,[3,"q"],[4,"y"],[4,"z"],[5,"r"],[3,"j"],[4,"k"],[4,"j"],[5,"y"],[4,"w"],[5,"k"]//100
            ,[5,"q"],[6,"k"],[3,"i"],[4,"n"],[4,"t"],[5,"r"],[4,"n"],[5,"e"],[5,"r"],[6,"i"]//110
            ,[4,"a"],[5,"j"],[5,"n"],[6,"k"],[5,"a"],[6,"e"],[6,"a"],[7,"e"],[1,"e"],[2,"a"]//120
            ,[2,"e"],[3,"a"],[2,"k"],[3,"n"],[3,"j"],[4,"a"],[2,"i"],[3,"r"],[3,"e"],[4,"r"]//130
            ,[3,"r"],[4,"i"],[4,"r"],[5,"i"],[2,"k"],[3,"q"],[3,"k"],[4,"q"],[3,"y"],[4,"y"]//140
            ,[4,"k"],[5,"j"],[3,"r"],[4,"z"],[4,"j"],[5,"q"],[4,"t"],[5,"r"],[5,"n"],[6,"a"]//150
            ,[2,"e"],[3,"j"],[3,"e"],[4,"r"],[3,"k"],[4,"k"],[4,"j"],[5,"n"],[3,"e"],[4,"j"]//160
            ,[4,"e"],[5,"c"],[4,"j"],[5,"y"],[5,"c"],[6,"c"],[3,"j"],[4,"w"],[4,"j"],[5,"q"]//170
            ,[4,"k"],[5,"k"],[5,"y"],[6,"k"],[4,"r"],[5,"q"],[5,"c"],[6,"n"],[5,"n"],[6,"k"]//180
            ,[6,"c"],[7,"c"],[2,"a"],[3,"i"],[3,"j"],[4,"a"],[3,"q"],[4,"n"],[4,"w"],[5,"a"]//190
            ,[3,"r"],[4,"t"],[4,"j"],[5,"n"],[4,"z"],[5,"r"],[5,"q"],[6,"a"],[3,"n"],[4,"n"]//200
            ,[4,"k"],[5,"j"],[4,"y"],[5,"e"],[5,"k"],[6,"e"],[4,"i"],[5,"r"],[5,"y"],[6,"k"]//210
            ,[5,"r"],[6,"i"],[6,"k"],[7,"e"],[3,"a"],[4,"a"],[4,"r"],[5,"i"],[4,"q"],[5,"j"]//220
            ,[5,"q"],[6,"a"],[4,"r"],[5,"n"],[5,"c"],[6,"c"],[5,"q"],[6,"k"],[6,"n"],[7,"c"]//230
            ,[4,"a"],[5,"a"],[5,"n"],[6,"a"],[5,"j"],[6,"e"],[6,"k"],[7,"e"],[5,"i"],[6,"a"]//240
            ,[6,"c"],[7,"c"],[6,"a"],[7,"e"],[7,"c"],[8,"-"]],
	//copy paste clipboard
    clipboard=[],
    gridWidth=30,
    gridHeight=20,
    selectArea={a:0,top:0,right:0,bottom:0,left:0,pastLeft:0,pastTop:0,pastRight:0,pastBottom:0},
    copyArea={top:0,right:0,bottom:0,left:0},
    mode=0,
    darkMode=0,
    ship=[{stage:0,activeWidth:0,width:0,rle:"",Ypos:0,period:0,multiplier:1,reset:2,nextCheck:0},
          {stage:0,activeWidth:0,width:0,rle:"",Ypos:0,period:0,multiplier:1,reset:2,nextCheck:0},
          {stage:0,activeWidth:0,width:0,rle:"",Ypos:0,period:0,multiplier:1,reset:2,nextCheck:0},
          {stage:0,activeWidth:0,width:0,rle:"",Ypos:0,period:0,multiplier:1,reset:2,nextCheck:0}];

var //distance between pattern and border
	margin={top:0,bottom:0,right:0,left:0},
    //canvas fill color(0-dark,1-light)
    detailedCanvas=true,
    //grid array
    grid=[[],[]],
    //for loop variables
    h=0,
    i=0,
    j=0,
    //
    key=[],
    //toggle grid lines
    gridLines=true,
    //mouse and touch inputs
    mouse={
	    //which button is down
	    clickType:0,
	    //position of input
	    x:0,y:0,
	    //past position
	    pastX:0,pastY:0,
	    //position of 2nd input
	    x2:0,y2:0,
	    //past position
	    pastX2:0,pastY2:0},
    //amount of pause between generations
    //interval=0,
    //point of time where the update cycle starts
    //intervalStart=0,
    //number of genertions updated
    stepSize=1,
    //genertion where the update cycle starts
    stepStart=0,
    //rulestring
    rulestring="B3/S23",
    //is the grid active(not all still life)
    isActive=0,
    //has the user edited the simulation
    hasChanged=0,
    //ID of the thing being dragged(0=nothing)
    dragID=0,
    //thickness of the space around the pattern
    gridMargin=3,
    //game states
	s={
	   //which border is being dragged
	   d:0,
	   //what state is being drawn in draw mode(-1:auto,0:state 0,etc...)
	   e:-1,
	   //which grid is being used
	   g:0,
	   //is any key pressed
	   k:[false,false],
	   //which mode the sim is in(draw,move,select)
	   mode:0,
	   //oscillator search settings
	   o:[[1],[1]],
	   //Play(1) or Pause(0) the simulation
	   p:0,
	   //rule of the cellular automata
	   r:[],
	   //current cell state being written
	   s:-1,
	   //time of last update in milliseconds
	   t:0,},
	//time elapsed
	genCount=0,
	//list of actions for undo and redo
	actionStack=[],
	currentIndex=-1,
	startIndex=0,
	//width of each cell
	cellWidth=20,
	//current cell logged and amount
	log={cell:0,amount:0},
	      //position of the current view(x/y position,zoom)
	view={x:-0,y:0,z:1,
	      //position of the view for when a pointer clicks or touches
	      touchX:0,touchY:0,touchZ:1,
	      //amount that the grid shifts
	      shiftX:0,shiftY:0,
	      //position of the view during a copy
	      copyX:0,copyY:0,
	      //how much the grid edge is moved
	      u:0,d:0,r:0,l:0};

//setup grid
for(let h=0;h<Math.floor(600/cellWidth);h++){
	grid[0].push([]);
	grid[1].push([]);
	for(let i=0;i<Math.floor(400/cellWidth);i++){
		//# of neighbors,touched,state,future state
		grid[0][h].push(0);
		grid[1][h].push(0);
	}
}
//set the rule to Conway's Game of Life
rule("B3/S23");
//turn dark mode on
setDark();
//automatically chooses the state being written
drawState(-1);
//save the empty grid
done();

//mouse input
canvas.onmousedown = function(event){
	mouse.clickType = event.buttons;
	dragID=0;
	getInput(event);
	inputReset();
	s.s=-1;
};
canvas.onmousemove = function(event){
	mouse.clickType = event.buttons;
	getInput(event);
};

canvas.onwheel = function(event){
	//event.preventDefault();
};
canvas.onmouseup = function(event){
	mouse.clickType=  0;
	dragID=0;
	getInput(event);
	inputReset();
	if(hasChanged!==0){
		done();
	}
};

window.onkeydown = function(event){
	if(event.keyCode!==9&&(event.target.nodeName!=="INPUT"||event.target.type!="text")){
		key[event.keyCode]=true;
	  if(s.k[0]===false&&s.p===0)requestAnimationFrame(main);
	  s.k[0]=true;
	  event.preventDefault();
	}
};

window.onkeyup = function(event){
	key[event.keyCode]=false;
	s.k[0]=false;
	for(h in key){
		if(key[h]===true)s.k[0]=true;
	}
	s.k[1]=false;
};

window.onresize = function(event){
	if(s.p===0)requestAnimationFrame(main);
};
//touch inputs
canvas.ontouchstart = function(event){
	dragID=  0;
	getInput(event);
	inputReset();
	s.s= -1;
	if(event.cancelable)event.preventDefault();
};

canvas.ontouchend = function(event){
	dragID=  0;
	getInput(event);
	inputReset();
	if(hasChanged!==0){
		done();
	}
};

canvas.ontouchmove = function(event){
	getInput(event);
};

//update the randomize density slider
document.getElementById("density").oninput = function() {
	document.getElementById("percent").innerHTML = this.value+"%";
};

function setDark(){
	if(darkMode){
		darkMode=0;
		if(detailedCanvas===true){
			canvas.style.backgroundColor="#f1f1f1";
		}else{
			canvas.style.backgroundColor="#e4e4e4";
		}
		document.body.style.backgroundColor="#fff";
		document.body.style.color="#000";
		document.getElementById("error").style.backgroundColor="#fff";
		document.getElementsByTagName("textarea")[0].style.backgroundColor="#fff";
		document.getElementsByTagName("textarea")[0].style.color="#000";
		for(let h=0;h<3;h++){
			document.getElementById("Button"+h).style.outlineColor="#000";
		}
		let length=document.getElementsByTagName("button").length;
		for(let h=0;h<length;h++){
			document.getElementsByTagName("button")[h].style.backgroundColor="#f1f1f1";
			document.getElementsByTagName("button")[h].style.borderColor="#000";
			document.getElementsByTagName("button")[h].style.outlineColor="#000";
			document.getElementsByTagName("button")[h].style.color="#000";
		}
		length=document.getElementsByTagName("input").length;
		for(let h=0;h<length;h++){
			document.getElementsByTagName("input")[h].style.backgroundColor="#fff";
			document.getElementsByTagName("input")[h].style.borderColor="#000";
			document.getElementsByTagName("input")[h].style.color="#000";
		}
		length=document.getElementsByClassName("borderColor").length;
		for(let h=0;h<length;h++){
			document.getElementsByClassName("borderColor")[h].style.borderColor="#000";
		}
		//document.getElementById("draw").style.borderColor="#f1f1f1";
	}else{
		darkMode=1;
		if(detailedCanvas===true){
			canvas.style.backgroundColor="#222";
		}else{
			canvas.style.backgroundColor="#2d2d2d";
		}
		document.body.style.backgroundColor="#111";
		document.body.style.color="#bbb";
		document.getElementById("error").style.backgroundColor="#111";
		document.getElementsByTagName("textarea")[0].style.backgroundColor="#222";
		document.getElementsByTagName("textarea")[0].style.color="#bbb";
		for(let h=0;h<3;h++){
			document.getElementById("Button"+h).style.outlineColor="#bbb";
		}
		let length=document.getElementsByTagName("button").length;
		for(let h=0;h<length;h++){
			document.getElementsByTagName("button")[h].style.backgroundColor="#222";
			document.getElementsByTagName("button")[h].style.borderColor="#222";
			document.getElementsByTagName("button")[h].style.outlineColor="#bbb";
			document.getElementsByTagName("button")[h].style.color="#bbb";
		}
		length=document.getElementsByTagName("input").length;
		for(let h=0;h<length;h++){
			document.getElementsByTagName("input")[h].style.backgroundColor="#222";
			document.getElementsByTagName("input")[h].style.borderColor="#222";
			document.getElementsByTagName("input")[h].style.color="#bbb";
		}
		length=document.getElementsByClassName("borderColor").length;
		for(let h=0;h<length;h++){
			document.getElementsByClassName("borderColor")[h].style.borderColor="#bbb";
		}
		document.getElementById("draw").style.borderRightColor="#bbb";
	}
	drawState(s.e);
	render();
}

//resets various values at the start and end of inputs
function inputReset(){
	//reset mouse variables
	mouse.pastX=mouse.x;
	mouse.pastY=mouse.y;
	mouse.pastX2=mouse.x2;
	mouse.pastY2=mouse.y2;
	//reset viewport variables
	view.touchX=view.x;
	view.touchY=view.y;
	view.touchZ=view.z;
	if(selectArea.a>0){
		selectArea.pastLeft=selectArea.left;
		selectArea.pastTop=selectArea.top;
		selectArea.pastRight=selectArea.right;
		selectArea.pastBottom=selectArea.bottom;
	}
	scaleGrid();
	if(selectArea.left===selectArea.right||selectArea.top===selectArea.bottom)selectArea.a=0;
}

function getInput(e){
	if(e.touches&&e.touches.length>0){
		mouse.x=(e.touches[0].clientX-canvas.getBoundingClientRect().left)/CH*400;
		mouse.y=(e.touches[0].clientY-canvas.getBoundingClientRect().top)/CH*400;
		if(e.touches.length>1){
			mouse.x2=(e.touches[1].clientX-canvas.getBoundingClientRect().left)/CH*400;
			mouse.y2=(e.touches[1].clientY-canvas.getBoundingClientRect().top)/CH*400;
		}else{
			mouse.x2=0;
			mouse.y2=0;
		}
	}else{
		if(mouse.clickType>0){
			mouse.x=(e.clientX-canvas.getBoundingClientRect().left)/CH*400;
			mouse.y=(e.clientY-canvas.getBoundingClientRect().top)/CH*400;
		}else{
			mouse={x:0,y:0};
		}
	}
	if(s.p===0&&s.k[0]===false)requestAnimationFrame(main);
}

function keyInput(){
	//i and o for zoom
	if(key[73])view.z*=1.05;
	if(key[79])view.z/=1.05;
	//arrow keys for move
	if(key[37])view.x-=0.5/view.z;
	if(key[38])view.y-=0.5/view.z;
	if(key[39])view.x+=0.5/view.z;
	if(key[40])view.y+=0.5/view.z;
	//actions to only be taken once
	if(s.k[1]===false){
		//ctrl-x,ctrl-c and ctrl-v for cut,copy and paste
		if(key[17]&&key[88]){
			cut();
			s.k[1]=true;
		}
		if(key[17]&&key[67]){
			copy();
			s.k[1]=true;
		}
		if(key[17]&&key[86]){
			paste();
			s.k[1]=true;
		}
		//d,m and s for switching modes
		if(key[68]){
			draw();
			s.k[1]=true;
		}
		if(key[77]){
			move();
			s.k[1]=true;
		}
		if(key[83]){
			select();
			s.k[1]=true;
		}
		//space to start and stop
		if(key[32]){
			start(0);
			s.k[1]=true;
		}
		//n for next gen
		if(key[78]){
			next();
			s.k[1]=true;
		}
		//delete to clear
		if(key[46]){
			clearGrid();
			s.k[1]=true;
		}
	}
}

//toggle updating the simulation
function start(newFrame){
	if(s.p===0){
		s.p=1;
		stepStart=genCount;
		if(newFrame!==0)requestAnimationFrame(main);
	}else{
		s.p=0;
	}
}

//move e frames forward
function next(){
	if(s.p===0)requestAnimationFrame(main);
	s.p=-stepSize;
	stepStart=genCount;
}

//toggle drawing the grid
function toggleLines(){
	if(gridLines){
		gridLines=false;
	}else{
		gridLines=true;
	}
	if(s.p===0)render();
}

function getColor(cellState){
	if(darkMode){
		if(cellState===0){
			return "#222";
		}else if(cellState===1){
			return "#f1f1f1";
		}else{
			let color=240/s.r[2]*(s.r[2]-cellState);
			return "rgb("+color+","+color+","+color+")";
		}
	}else{
		if(cellState===0){
			return "#f1f1f1";
		}else if(cellState===1){
			return "#000";
		}else{
			let color=240/s.r[2]*(cellState-1);
			return "rgb("+color+","+color+","+color+")";
		}
	}
}

//switch to draw mode
function draw(){
	if(selectArea.a===2)selectArea.a=0;
	mode=0;
	for(let h=0;h<3;h++)document.getElementById("Button"+h.toString()).style.outlineStyle="none";
	document.getElementById("Button0").style.outlineStyle="solid";
	if(s.p===0)render();
}

//switch to move mode
function move(){
	mode=1;
	for(let h=0;h<3;h++)document.getElementById("Button"+h.toString()).style.outlineStyle="none";
	document.getElementById("Button1").style.outlineStyle="solid";
}

//swith to select mode
function select(){
	if(selectArea.a===2||selectArea.a===1&&mode===2)selectArea.a=0;
	mode=2;
	for(let h=0;h<3;h++)document.getElementById("Button"+h.toString()).style.outlineStyle="none";
	document.getElementById("Button2").style.outlineStyle="solid";
	if(s.p===0)render();
}

//save and action to the undo stack
function done(){
	if(currentIndex-startIndex<300){
		currentIndex++;
		while(currentIndex<actionStack.length)actionStack.pop();
		actionStack.push({a:isActive,b:startIndex,grid:"",w:gridWidth,h:gridHeight,margin:{t:0,b:0,r:0,l:0},o:{x:view.shiftX,y:view.shiftY},time:genCount});
	}else{
		for(let h=startIndex;h<currentIndex;h++){
			//prevents the startIndex from being overwritten unless at 0
			if(h===startIndex&&h>0)h++;
			actionStack[h]=actionStack[h+1];
		}
		actionStack[currentIndex]={a:isActive,b:startIndex,grid:"",w:gridWidth,h:gridHeight,margin:{t:0,b:0,r:0,l:0},o:{x:view.shiftX,y:view.shiftY},time:genCount};
	}
	xsides(0,gridHeight);
	ysides(0,gridWidth);
	actionStack[currentIndex].grid=readPattern(margin.top,margin.right,margin.bottom,margin.left);
	actionStack[currentIndex].margin={t:margin.top,b:margin.bottom,r:margin.right,l:margin.left};
	//console.log(actionStack[currentIndex].o.x+" "+view.shiftX);
	hasChanged=0;
}

//pull information from the undostack
function readStack(){
	let xOffset=actionStack[currentIndex].o.x-view.shiftX,
	    yOffset=actionStack[currentIndex].o.y-view.shiftY;
	//return viewing window to it's previous position
	view.x+=xOffset;
	view.y+=yOffset;
	//return highlighted area to it's previous position
	selectArea.left+=xOffset;
	selectArea.right+=xOffset;
	selectArea.top+=yOffset;
	selectArea.bottom+=yOffset;
	//return highlighted area to it's previous position
	selectArea.pastLeft+=xOffset;
	selectArea.pastRight+=xOffset;
	selectArea.pastTop+=yOffset;
	selectArea.pastBottom+=yOffset;
	//console.log(actionStack[currentIndex].o.x+" "+view.shiftX);
	//return highlighted copy area to it's previous position
	view.r=actionStack[currentIndex].w-gridWidth;
	view.d=actionStack[currentIndex].h-gridHeight;
	view.shiftX=actionStack[currentIndex].o.x;
	view.shiftY=actionStack[currentIndex].o.y;
	//set startIndex to zero when actions are undone past the start
	startIndex=actionStack[currentIndex].b;
	scaleGrid();
	if(genCount!==actionStack[currentIndex].time){
		genCount=actionStack[currentIndex].time;
		document.getElementById("gens").innerHTML="Generation "+genCount+".";
	}
	for(let h=0;h<actionStack[currentIndex].margin.l;h++){
		for(let i=0;i<actionStack[currentIndex].h;i++){
			grid[s.g][h][i]=base;
		}
	}
	for(let i=0;i<actionStack[currentIndex].margin.t;i++){
		for(let h=0;h<actionStack[currentIndex].w;h++){
			grid[s.g][h][i]=base;
		}
	}
	for(let h=actionStack[currentIndex].w-actionStack[currentIndex].margin.r;h<actionStack[currentIndex].w;h++){
		for(let i=0;i<actionStack[currentIndex].h;i++){
			grid[s.g][h][i]=base;
		}
	}
	for(let i=actionStack[currentIndex].h-actionStack[currentIndex].margin.b;i<actionStack[currentIndex].h;i++){
		for(let h=0;h<actionStack[currentIndex].w;h++){
			grid[s.g][h][i]=base;
		}
	}
	gridWidth=actionStack[currentIndex].w;
	gridHeight=actionStack[currentIndex].h;
	if(""===actionStack[currentIndex].grid){
		for(let h=0;h<gridWidth;h++){
			for(let i=0;i<gridHeight;i++){
				grid[s.g][h][i]=base;
			}
		}
	}else{
		drawPattern(0,actionStack[currentIndex].grid.split(""),actionStack[currentIndex].margin.l,actionStack[currentIndex].margin.t);
	}
}

function undo(){
	if(currentIndex>0){
		currentIndex--;
		readStack();
		s.p=0;
		render();
	}
}

function redo(){
	if(actionStack.length>=currentIndex+2){
		currentIndex++;
		readStack();
		s.p=0;
		render();
	}
}

//go to before the simulation started
function restart(){
	if(startIndex!==0){
		currentIndex=startIndex;
		startIndex=0;
		base=0;
		readStack();
		if(arguments.length===0){
			s.p=0;
			render();
		}
	}
}

function round(num){
	return Math.round(num*1000)/1000;
}

//function for reading the grid
function G(first,second){
	if(grid[s.g][Math.floor(round(mod(first+view.x+(300-300/view.z)/cellWidth,gridWidth)))]
	 &&!isNaN(grid[s.g][Math.floor(round(mod(first+view.x+(300-300/view.z)/cellWidth,gridWidth)))]
	                 [Math.floor(round(mod(second+view.y+(200-200/view.z)/cellWidth,gridHeight)))])){
		return grid[s.g][Math.floor(round(mod(first+view.x+(300-300/view.z)/cellWidth,gridWidth)))]
				      [Math.floor(round(mod(second+view.y+(200-200/view.z)/cellWidth,gridHeight)))];
	}else{
		//console.log(first+" "+second);
		return 2.3;
	}
}

function stretch(){
	if(!document.getElementById("xloop").checked){
		if(selectArea.left<0)view.l=selectArea.left;
		if(selectArea.right>gridWidth)view.r=selectArea.right-gridWidth;
	}
	if(!document.getElementById("yloop").checked){
		if(selectArea.top<0)view.u=selectArea.top;
		if(selectArea.bottom>gridHeight)view.d=selectArea.bottom-gridHeight;
	}
}

function menu(n){
	if(document.getElementById("menu"+n.toString()).style.display==="block"){
		document.getElementById("arrow"+n.toString()).innerHTML="&#x27A1";
		document.getElementById("menu"+n.toString()).style.display="none";
	}else{
		document.getElementById("arrow"+n.toString()).innerHTML="&#x2B07";
		document.getElementById("menu"+n.toString()).style.display="block";
	}
}

function drawState(n){
	s.e=n;
	//document.getElementById("dropdown-content").style.display="none";
	if(n===-1){
		document.getElementById("dropbtn").innerHTML="Auto";
		if(darkMode){
			document.getElementById("dropbtn").style.color="#bbb";
			document.getElementById("dropbtn").style.backgroundColor="#222";
		}else{
			document.getElementById("dropbtn").style.color="#000";
			document.getElementById("dropbtn").style.backgroundColor="#eee";
		}
		document.getElementById("dropdown-content").innerHTML="";
	}else{
		document.getElementById("dropbtn").innerHTML=n.toString();
		if(n>s.r[2]*0.8||n===0){
			if(darkMode){
				document.getElementById("dropbtn").style.color="#bbb";
			}else{
				document.getElementById("dropbtn").style.color="#000";
			}
		}else{
			if(darkMode){
				document.getElementById("dropbtn").style.color="#000";
			}else{
				document.getElementById("dropbtn").style.color="#bbb";
			}
		}
		document.getElementById("dropbtn").style.backgroundColor=getColor(n);
		document.getElementById("dropdown-content").innerHTML="<div id=\"auto\" onclick=\"drawState(-1)\">Auto</div>";
		if(darkMode){
			document.getElementById("auto").style.color="#bbb";
			document.getElementById("auto").style.borderColor="#bbb";
			document.getElementById("auto").style.backgroundColor="#222";
		}else{
			document.getElementById("auto").style.color="#000";
			document.getElementById("auto").style.borderColor="#000";
			document.getElementById("auto").style.backgroundColor="#f1f1f1";
		}
	}
	for(let h=0;h<s.r[2];h++){
		if(h!==n){
			document.getElementById("dropdown-content").innerHTML+="<div id=\"s"+h+"\" onclick=\"drawState("+h+")\">"+h+"</div>";
			document.getElementById("s"+h).style.backgroundColor=getColor(h);
			if(h>s.r[2]*0.8||h===0){
				if(darkMode){
					document.getElementById("s"+h).style.color="#bbb";
					document.getElementById("s"+h).style.borderColor="#bbb";
				}else{
					document.getElementById("s"+h).style.color="#000";
					document.getElementById("s"+h).style.borderColor="#000";
				}
			}else{
				if(darkMode){
					document.getElementById("s"+h).style.color="#000";
					document.getElementById("s"+h).style.borderColor="#bbb";
				}else{
					document.getElementById("s"+h).style.color="#bbb";
					document.getElementById("s"+h).style.borderColor="#000";
				}
			}
		}
	}
}

//set default view
function fitView(){
	view.x=(gridWidth-30)/2;
	view.y=(gridHeight-20)/2;
	view.touchX=0;
	view.touchY=0;
	view.z=Math.min(600/cellWidth/gridWidth,400/cellWidth/gridHeight);
	view.touchZ=Math.min(600/cellWidth/gridWidth,400/cellWidth/gridHeight);
	if(view.z<0.2&&detailedCanvas===true){
		detailedCanvas=false;
		if(darkMode){
			canvas.style.backgroundColor="#2d2d2d";
		}else{
			canvas.style.backgroundColor="#e4e4e4";
		}
	}else if(view.z>0.2&&detailedCanvas===false){
		detailedCanvas=true;
		if(darkMode){
			canvas.style.backgroundColor="#222222";
		}else{
			canvas.style.backgroundColor="#f1f1f1";
		}
	}
	if(s.p===0)render();
}

//modulous function
function mod(first,second){
	while(first<0){
		first+=second;
	}
	while(first>=second){
		first-=second;
	}
	return first;
}

//clear the grid
function clearGrid(){
	let top,right,bottom,left;
	if(arguments.length===4){
		top=arguments[0];
		right=arguments[1];
		bottom=arguments[2];
		left=arguments[3];

		for(let h=left;h<right;h++){
			for(let i=top;i<bottom;i++){
				grid[s.g][h][i]=base;
			}
		}
	}else{
		if(selectArea.a!==0){
			if(selectArea.a===2){
				selectArea.a=0;
			}else{
				top=   Math.max(0,selectArea.top);
				right= Math.min(gridWidth,selectArea.right);
				bottom=Math.min(gridHeight,selectArea.bottom);
				left=  Math.max(0,selectArea.left);
			}
		}else{
			top=0;
			right=gridWidth;
			bottom=gridHeight;
			left=0;
		}

		isActive=0;
		if(right){
			for(let h=left;h<right;h++){
				for(let i=top;i<bottom;i++){
					if(grid[s.g][h][i]!==0){
						grid[s.g][h][i]=0;
						isActive=1;
					}
				}
			}
		}
		base=0;
		if(isActive===1&&arguments.length===0)done();
		s.p=0;
		render();
	}
}

function copy(){
	clipboard=[];
	if(selectArea.a===2)selectArea.a=0;
	copyArea.left=selectArea.a===1?selectArea.left:0;
	copyArea.top=selectArea.a===1?selectArea.top:0;
	copyArea.right=selectArea.a===1?selectArea.right:gridWidth;
	copyArea.bottom=selectArea.a===1?selectArea.bottom:gridHeight;

	view.copyX=view.x;
	view.copyY=view.y;

	for(let h=copyArea.left;h<copyArea.right;h++){
		clipboard.push([]);
		for(let i=copyArea.top;i<copyArea.bottom;i++){
			if(h>=0&&h<gridWidth&&i>=0&&i<gridHeight){
				clipboard[clipboard.length-1].push(grid[s.g][h][i]);
			}else{
				clipboard[clipboard.length-1].push(base);
			}
		}
	}
	if(arguments.length===0)selectArea.a=0;
	s.p=0;
	render();
}

function cut(){
	copy(0);
	clearGrid();
}

function paste(){
	if(clipboard.length>0){
		//enter move mode
		move();
		//first press of paste shows the pattern
		if(selectArea.a!==2){
			selectArea.a=2;
			selectArea.left= Math.round(view.x-view.copyX)+copyArea.left;
			selectArea.top= Math.round(view.y-view.copyY)+copyArea.top;
			selectArea.right=Math.round(view.x-view.copyX)+copyArea.right;
			selectArea.bottom=Math.round(view.y-view.copyY)+copyArea.bottom;
		//the next press places it on the grid
		}else{
			stretch();
			scaleGrid();
			for(let h=0;h<clipboard.length;h++){
				if(h+selectArea.left<gridWidth)for(let i=0;i<clipboard[0].length;i++){
					if(i+selectArea.top<gridHeight)grid[s.g][h+selectArea.left][i+selectArea.top]=clipboard[h][i];
				}
			}
		}

		s.p=0;
		addMargin();
		done();
		render();
	}
}

//import several settings
function save(){
	document.getElementById("error").innerHTML="";
	//save zoom
	if(document.getElementById("zoom").value){
		if(isNaN(document.getElementById("zoom").value)){
			document.getElementById("error").innerHTML="Zoom must be a decimal";
		}else{
			let buffer=document.getElementById("zoom").value.split(".");
			if(buffer.length>1){
				if(!buffer[0])buffer[0]=0;
				//do thus if the input has a decimal point
				view.z=parseInt(buffer[0],10)+parseInt(buffer[1],10)/Math.pow(10,buffer[1].split("").length);
			}else{
				if(!buffer[0])buffer[0]=1;
				//do this if the input is an intinger
				view.z=parseInt(buffer[0],10);
			}
		}
	}
	//save the rule
	rule(1);
	//set any invalid cell states to 0
	for(let h=0;h<gridWidth;h++){
		for(let i=0;i<gridHeight;i++){
			if(grid[s.g][h][i]>=s.r[2])grid[s.g][h][i]=0;
		}
	}
	//save interval between generations
	/*if(document.getElementById("interval").value){
		if(isNaN(document.getElementById("interval").value)){
			document.getElementById("error").innerHTML="Interval must be a number";
		}else{
			interval=parseInt(document.getElementById("interval").value,10);
		}
	}*/
	//save step size
	if(document.getElementById("step").value){
		if(isNaN(document.getElementById("step").value)){
			document.getElementById("error").innerHTML="Genertions Per Update must be a number";
		}else{
			stepSize=parseInt(document.getElementById("step").value,10);
		}
	}
	//save oscillator search settings
	if(document.getElementById("restart").value){
		s.o[0]=document.getElementById("restart").value.split(",");
	}else{
		s.o=[[1],[1]];
	}
	/*if(document.getElementById("export").value){
		s.o[0].push(...document.getElementById("export").value.split(","));
		s.o[1]=document.getElementById("export").value.split(",");
	}*/
	for(let h=0;h<s.o[0].length;h++){
		s.o[0][h]=parseInt(s.o[0][h]);
	}
	for(let h=0;h<s.o[1].length;h++){
		s.o[1][h]=parseInt(s.o[1][h]);
	}
	s.p=0;
	render();
}

//fill the grid with random cell states
function randomize(){
	if(selectArea.a===2)selectArea.a=0;
	let top,bottom,left,right;
	if(selectArea.a===1){
		stretch();
		scaleGrid();
		left=selectArea.left;
		right=selectArea.right;
		top=selectArea.top;
		bottom=selectArea.bottom;
	}else{
		if(document.getElementById("xloop").checked){
			left=0;
			right=gridWidth;
		}else{
			left=3;
			right=gridWidth-3;
		}
		if(document.getElementById("yloop").checked){
			top=0;
			bottom=gridHeight;
		}else{
			top=3;
			bottom=gridHeight-3;
		}
	}
	for(let h=left;h<right;h++){
		for(let i=top;i<bottom;i++){
			if(grid[s.g][h]){
				if(Math.random()<document.getElementById("density").value/100){
					grid[s.g][h][i]=1;
				}else{
					grid[s.g][h][i]=0;
				}
			}
		}
	}
	//D_4+ symmetry
	if(document.getElementById("d4").checked){
		for(let h=left;h<right;h++){
			for(let i=top;i<bottom;i++){
				if(h<Math.ceil(left+(right-left)/2)){
					if(i>Math.floor(top+((bottom-top)/2))-1)grid[s.g][h][i]=grid[s.g][h][top+bottom-i-1];
				}else{
					grid[s.g][h][i]=grid[s.g][left+right-h-1][i];
				}
			}
		}
	}
	genCount=0;
	document.getElementById("gens").innerHTML="Generation 0.";
	//addMargin();
	done();
	if(s.p===0)render();
}

function search(){
	//search for patterns
	let period=0,h=0;
	for(h=1;h*5<genCount&&h<currentIndex;h++){
		if(actionStack[currentIndex-h].grid===actionStack[currentIndex].grid){
			isActive=0;
			if(s.o[0].indexOf(h)===-1&&(period>h||period===0)){
				period=h;
			}
			break;
		}
	}
	if(isActive===0){
		restart(0);
		if(period!==0&&document.getElementById("export").checked){
			document.getElementById("rle").value+=exportRLE(period);
		}
		s.p=1;
		randomize();
	}
}
//this search can only search as far as the action stack goes
function catchShips(){
	//stage of identifying ships(stored in ____Ship.stage variable):
	//0-no ship
	//1-ship like edge movement detected
	//2-ship's width is measured
	//3-ship's pattern is stored
	//4-ship's pattern is repeated
	//5-ships's width is verified
	//6-ships pattern is verified
	for(let h=0;h<4;h++){
		let i,totalMovement=0,emptyLines=0,maxI=[];
		xsides(0,gridHeight);
		if(ship[h].period===0){
			i=1;
		}else{
			i=ship[h].period;
		}
		//checks all periods up to 150
		while(i<150&&i*2<currentIndex){
			let j=0;
			totalMovement=0;
			//checks if this period has patterns in movment and breaks the loop if the pattern breaks
			for(;j<300&&j<currentIndex-1;j++){
				if(h===0){
					let change = actionStack[currentIndex-j].o.y-actionStack[currentIndex-j-1].o.y;
					if(j>=i&&change!==actionStack[currentIndex-j+i].o.y-actionStack[currentIndex-j-1+i].o.y){
						break;
					}
					if(j<i)totalMovement+=change;
				}else if(h===1){
					let change = actionStack[currentIndex-j-1].o.x-actionStack[currentIndex-j-1].w-(actionStack[currentIndex-j].o.x-actionStack[currentIndex-j].w);
					if(j>=i&&change!==actionStack[currentIndex-j-1+i].o.x-actionStack[currentIndex-j-1+i].w-(actionStack[currentIndex-j+i].o.x-actionStack[currentIndex-j+i].w)){
						break;
					}
					if(j<i)totalMovement+=change;
				}else if(h===2){
					let change = actionStack[currentIndex-j-1].o.y-actionStack[currentIndex-j-1].h-(actionStack[currentIndex-j].o.y-actionStack[currentIndex-j].h);
					if(j>=i&&change!==actionStack[currentIndex-j-1+i].o.y-actionStack[currentIndex-j-1+i].h-(actionStack[currentIndex-j+i].o.y-actionStack[currentIndex-j+i].h)){
						break;
					}
					if(j<i)totalMovement+=change;
				}else if(h===3){
					if(j>=i&&actionStack[currentIndex-j].o.x-actionStack[currentIndex-j-1].o.x!==actionStack[currentIndex-j+i].o.x-actionStack[currentIndex-j-1+i].o.x){
						break;
					}
					if(j<i)totalMovement+=actionStack[currentIndex-j].o.x-actionStack[currentIndex-j-1].o.x;
				}
			}
			if(totalMovement>0&&j>10&&j>=i*2){
				ship[h].period=i;
				if(ship[h].stage===0)ship[h].stage=1;
				break;
			}else{
				ship[h].period=0;
				ship[h].stage=0;
				ship[h].Ypos=0;
				ship[h].rle="";
				ship[h].nextCheck=0;
				ship[h].multiplier=1;
				ship[h].width=0;
				ship[h].reset=2;
			}
			i++;
		}
		switch(h){
			case 0:
				if(ship[0].stage===1||ship[0].stage===4){
					for(let j=Math.min(gridHeight-1,Math.max(0,margin.top+ship[0].width));j<gridHeight;j++){
						emptyLines++;
						for(let i=0;i<gridWidth;i++){
							if(grid[s.g][i][j]!==base){
								emptyLines=0;
								break;
							}
						}
						let newWidth=(j>margin.bottom)?margin.bottom-margin.top:j-margin.top-emptyLines+1;
						if(emptyLines>=2||j>=margin.bottom-1){
							if(ship[0].width>=newWidth){
								if(genCount>=ship[0].nextCheck){
									if(ship[0].stage===1)ship[0].stage=2;
									if(ship[0].stage===4)ship[0].stage=5;
									ship[0].reset=2;
								}
							}else if(ship[0].stage===1&&ship[0].width>ship[0].reset){
								ship[0].reset*=16;
								ship[0].width=0;
							}else{
								ship[0].width=newWidth;
								ship[0].stage=1;
							}
							break;
						}
					}
					if(genCount>=ship[0].nextCheck)ship[0].nextCheck=genCount+ship[0].period;
				}

				if(ship[0].stage===2||ship[0].stage===5||ship[0].nextCheck===genCount){
					xsides(margin.top,margin.top+ship[0].width);
					if(ship[0].stage===2)ship[0].stage=3;
					if(ship[0].stage===5){
						ship[0].stage=6;
						ship[0].Ypos=margin.left-view.shiftX;
						ship[0].nextCheck=genCount+ship[0].period;
						ship[0].rle=readPattern(margin.top,margin.right,margin.top+ship[0].width,margin.left);
						ship[0].multiplier=1;
					}
					if(ship[0].nextCheck===genCount){
						if(ship[0].rle===readPattern(margin.top,margin.right,margin.top+ship[0].width,margin.left)){
							if(ship[0].stage===3){
								ship[0].stage=4;
							}else{
								document.getElementById("rle").value+="\nfound ("+totalMovement*ship[0].multiplier+","+(Math.abs(margin.left-view.shiftX-ship[0].Ypos)*ship[0].multiplier)+")c/"+ship[0].period*ship[0].multiplier+" "+ship[0].rle;
								clearGrid(margin.top,margin.right,margin.top+ship[0].width,margin.left);
							}
							ship[0].nextCheck=genCount+ship[0].period*ship[0].reset;
						}else{
							if(ship[0].multiplier>=ship[0].reset){
								ship[0].reset*=2;
								ship[0].multiplier=1;
								ship[0].rle=readPattern(margin.top,margin.right,margin.top+ship[0].width,margin.left);
							}else{
								ship[0].multiplier++;
							}
							ship[0].nextCheck=genCount+ship[0].period;
						}
					}
				}
			break;
			case 1:
				if(ship[1].stage===1||ship[1].stage===4){
					for(let i=Math.min(gridWidth-1,Math.max(0,margin.right-ship[1].width));i>=0;i--){
						emptyLines++;
						for(let j=0;j<gridHeight;j++){
							if(grid[s.g][i][j]!==base){
								emptyLines=0;
								break;
							}
						}
						let newWidth=(i<margin.left)?margin.right-margin.left-1:margin.right-i-emptyLines;
						if(emptyLines>=2||i<=margin.left){
							if(ship[1].width>=newWidth){
								if(genCount>=ship[1].nextCheck){
									if(ship[1].stage===1)ship[1].stage=2;
									if(ship[1].stage===4)ship[1].stage=5;
									ship[1].reset=2;
								}
							}else if(ship[1].stage===1&&ship[1].width>ship[1].reset){
								ship[1].reset*=16;
								ship[1].width=0;
							}else{
								ship[1].width=newWidth;
								ship[1].stage=1;
							}
							break;
						}
					}
					if(genCount>=ship[1].nextCheck)ship[1].nextCheck=genCount+ship[1].period;
				}


				if(ship[1].stage===2||ship[1].stage===5||ship[1].nextCheck===genCount){
					ysides(margin.right-ship[1].width,margin.right);
					if(ship[1].stage===2)ship[1].stage=3;
					if(ship[1].stage===5){
						ship[1].stage=6;
						ship[1].Ypos=margin.top-view.shiftY;
						ship[1].nextCheck=genCount+ship[1].period;
						ship[1].rle=readPattern(margin.top,margin.right,margin.bottom,margin.right-ship[1].width);
						ship[1].multiplier=1;
					}
					if(ship[1].nextCheck===genCount){
						if(ship[1].rle===readPattern(margin.top,margin.right,margin.bottom,margin.right-ship[1].width)){
							if(ship[1].stage===3){
								ship[1].stage=4;
							}else{
								document.getElementById("rle").value+="\nfound ("+totalMovement*ship[1].multiplier+","+(Math.abs(margin.top-view.shiftY-ship[1].Ypos)*ship[1].multiplier)+")c/"+ship[1].period*ship[1].multiplier+" "+ship[1].rle;
								clearGrid(margin.top,margin.right,margin.bottom,margin.right-ship[1].width);
							}
							ship[1].nextCheck=genCount+ship[1].period*ship[1].reset;
						}else{
							if(ship[1].multiplier>=ship[1].reset){
								ship[1].reset*=2;
								ship[1].multiplier=1;
								ship[1].rle=readPattern(margin.top,margin.right,margin.bottom,margin.right-ship[1].width);
							}else{
								ship[1].multiplier++;
							}
							ship[1].nextCheck=genCount+ship[1].period;
						}
					}
				}
			break;
			case 2:
				if(ship[2].stage===1||ship[2].stage===4){
					for(let j=Math.min(gridHeight-1,Math.max(0,margin.bottom-ship[2].width));j>=0;j--){
						emptyLines++;
						for(let i=0;i<gridWidth;i++){
							if(grid[s.g][i][j]!==base){
								emptyLines=0;
								break;
							}
						}
						let newWidth=(j<margin.top)?margin.bottom-margin.top-1:margin.bottom-j-emptyLines;
						if(emptyLines>=2||j<=margin.top){
							if(ship[2].width>=newWidth){
								if(genCount>=ship[2].nextCheck){
									if(ship[2].stage===1)ship[2].stage=2;
									if(ship[2].stage===4)ship[2].stage=5;
									ship[2].reset=2;
								}
							}else if(ship[2].stage===1&&ship[2].width>ship[2].reset){
								ship[2].reset*=16;
								ship[2].width=0;
							}else{
								ship[2].width=newWidth;
								ship[2].stage=1;
							}
							break;
						}
					}
					if(genCount>=ship[2].nextCheck)ship[2].nextCheck=genCount+ship[2].period;
				}

				if(ship[2].stage===2||ship[2].stage===5||ship[2].nextCheck===genCount){
					xsides(margin.bottom-ship[2].width,margin.bottom);
					if(ship[2].stage===2)ship[2].stage=3;
					if(ship[2].stage===5){
						ship[2].stage=6;
						ship[2].Ypos=margin.left-view.shiftX;
						ship[2].nextCheck=genCount+ship[2].period;
						ship[2].rle=readPattern(margin.bottom-ship[2].width,margin.right,margin.bottom,margin.left);
						ship[2].multiplier=1;
					}
					if(ship[2].nextCheck===genCount){
						if(ship[2].rle===readPattern(margin.bottom-ship[2].width,margin.right,margin.bottom,margin.left)){
							if(ship[2].stage===3){
								ship[2].stage=4;
							}else{
								document.getElementById("rle").value+="\nfound ("+totalMovement*ship[2].multiplier+","+(Math.abs(margin.left-view.shiftX-ship[2].Ypos)*ship[2].multiplier)+")c/"+ship[2].period*ship[2].multiplier+" "+ship[2].rle;
								clearGrid(margin.bottom-ship[2].width,margin.right,margin.bottom,margin.left);
							}
							ship[2].nextCheck=genCount+ship[2].period*ship[2].reset;
						}else{
							if(ship[2].multiplier>=ship[2].reset){
								ship[2].reset*=2;
								ship[2].multiplier=1;
								ship[2].rle=readPattern(margin.bottom-ship[2].width,margin.right,margin.bottom,margin.left);
							}else{
								ship[2].multiplier++;
							}
							ship[2].nextCheck=genCount+ship[2].period;
						}
					}
				}
			break;
			case 3:
				if(ship[3].stage===1||ship[3].stage===4){
					for(let i=Math.min(gridWidth-1,Math.max(0,margin.left+ship[3].width));i<gridWidth;i++){
						emptyLines++;
						for(let j=0;j<gridHeight;j++){
							if(grid[s.g][i][j]!==base){
								emptyLines=0;
								break;
							}
						}
						let newWidth=(i>margin.right)?margin.right-margin.left:i-margin.left-emptyLines+1;
						if(emptyLines>=2||i>=margin.right-1){
							if(ship[3].width>=newWidth){
								if(genCount>=ship[3].nextCheck){
									if(ship[3].stage===1)ship[3].stage=2;
									if(ship[3].stage===4)ship[3].stage=5;
									ship[3].reset=2;
								}
							}else if(ship[3].stage===1&&ship[3].width>ship[3].reset){
								ship[3].reset*=16;
								ship[3].width=0;
							}else{
								ship[3].width=newWidth;
								ship[3].stage=1;
							}
							break;
						}
					}
					if(genCount>=ship[3].nextCheck)ship[3].nextCheck=genCount+ship[3].period;
				}


				if(ship[3].stage===2||ship[3].stage===5||ship[3].nextCheck===genCount){
					ysides(margin.left,margin.left+ship[3].width);
					if(ship[3].stage===2)ship[3].stage=3;
					if(ship[3].stage===5){
						ship[3].stage=6;
						ship[3].Ypos=margin.top-view.shiftY;
						ship[3].nextCheck=genCount+ship[3].period;
						ship[3].rle=readPattern(margin.top,margin.left+ship[3].width,margin.bottom,margin.left);
						ship[3].multiplier=1;
					}
					if(ship[3].nextCheck===genCount){
						if(ship[3].rle===readPattern(margin.top,margin.left+ship[3].width,margin.bottom,margin.left)){
							if(ship[3].stage===3){
								ship[3].stage=4;
							}else{
								document.getElementById("rle").value+="\nfound ("+totalMovement*ship[3].multiplier+","+(Math.abs(margin.top-view.shiftY-ship[3].Ypos)*ship[3].multiplier)+")c/"+ship[3].period*ship[3].multiplier+" "+ship[3].rle;
								clearGrid(margin.top,margin.left+ship[3].width,margin.bottom,margin.left);
							}
							ship[3].nextCheck=genCount+ship[3].period*ship[3].reset;
						}else{
							if(ship[3].multiplier>=ship[3].reset){
								ship[3].reset*=2;
								ship[3].multiplier=1;
								ship[3].rle=readPattern(margin.top,margin.left+ship[3].width,margin.bottom,margin.left);
							}else{
								ship[3].multiplier++;
							}
							ship[3].nextCheck=genCount+ship[3].period;
						}
					}
				}
			break;
		}
	}
}

//mainain a 1 cell thick margin around the pattern
function addMargin(){
	if(dragID===0){
		if(!document.getElementById("xloop").checked){
			xsides(0,gridHeight);
			if(margin.left!==0||margin.right!==0){
				view.l=margin.left-3;
				view.r=margin.right-gridWidth+3;
			}
			scaleGrid();
		}
		if(!document.getElementById("yloop").checked){
			ysides(0,gridWidth);
			if(margin.bottom!==0||margin.top!==0){
				view.u=margin.top-3;
				view.d=margin.bottom-gridHeight+3;
			}
			scaleGrid();
		}
	}
}

function xsides(top,bottom){
	margin.left=0;
	margin.right=0;
	for(let h=0;h<gridWidth;h++){
		for(let i=top;i<bottom;i++){
			if(grid[s.g][h][i]!==base){
				margin.left=h;
				h=gridWidth;
				i=bottom;
			}
		}
	}
	for(let h=gridWidth-1;h>=0;h--){
		for(let i=top;i<bottom;i++){
			if(grid[s.g][h][i]!==base){
				margin.right=h+1;
				h=-1;
				i=bottom;
			}
		}
	}
}

function ysides(left,right){
	margin.top=0;
	margin.bottom=0;
	for(let i=0;i<gridHeight;i++){
		for(let h=left;h<right;h++){
			if(grid[s.g][h][i]!==base){
				margin.top=i;
				h=right;
				i=gridHeight;
			}
		}
	}
	for(let i=gridHeight-1;i>=0;i--){
		for(let h=left;h<right;h++){
			if(grid[s.g][h][i]!==base){
				margin.bottom=i+1;
				h=right;
				i=-1;
			}
		}
	}
}

//function for scaling the grid
function scaleGrid(){
	if(view.r!==0||view.l!==0||view.u!==0||view.d!==0)hasChanged=1;
	//clear the part of the array being added to the grid
	for(let h=0;h<gridWidth+view.r&&h<grid[s.g].length;h++){
		for(let i=gridHeight;i<gridHeight+view.d&&i<grid[s.g][0].length;i++){
			grid[s.g][h][i]=base;
		}
	}
	for(let h=gridWidth;h<gridWidth+view.r&&h<grid[s.g].length;h++){
		for(let i=0;i<gridHeight&&i<grid[s.g][0].length;i++){
			grid[s.g][h][i]=base;
		}
	}
	//move left edge
	if(view.l<grid[s.g].length)while(view.l!==0){
		if(view.l>0){
			gridWidth--;
			view.l--;
			view.x--;
			view.touchX--;
			selectArea.left--;
			selectArea.right--;
			selectArea.pastLeft--;
			selectArea.pastRight--;
			view.shiftX--;
			grid[0].shift();
			grid[1].shift();
		}else{
			gridWidth++;
			view.l++;
			view.x++;
			view.touchX++;
			selectArea.left++;
			selectArea.right++;
			selectArea.pastLeft++;
			selectArea.pastRight++;
			view.shiftX++;
			grid[0].unshift([]);
			grid[1].unshift([]);
			for(let i=0;i<grid[0][1].length;i++){
				grid[0][0].push(base);
				grid[1][0].push(base);
			}
		}
	}
	//move right edge
	if(-view.r<grid[s.g].length){
		gridWidth+=view.r;
		view.r=0;
		while(gridWidth>grid[1].length){
			grid[0].push([]);
			grid[1].push([]);
			for(let i=0;i<grid[0][0].length;i++){
				grid[0][grid[0].length-1].push(base);
				grid[1][grid[1].length-1].push(base);
			}
		}
		/*
		while(view.r!==0){
			if(view.r>0){
				view.r--;
				grid[0].push([]);
				grid[1].push([]);
				for(let i=0;i<grid[0][0].length;i++){
					grid[0][grid[0].length-1].push(base);
					grid[1][grid[1].length-1].push(base);
				}
			}else{
				view.r++;
				grid[0].pop();
				grid[1].pop();
			}
		}*/
	}
	//move upper edge
	if(view.u<grid[s.g][0].length)while(view.u!==0){
		if(view.u>0){
			gridHeight--;
			view.u--;
			view.y--;
			view.touchY--;
			selectArea.top--;
			selectArea.bottom--;
			selectArea.pastTop--;
			selectArea.pastBottom--;
			view.shiftY--;
			for(let i=0;i<grid[0].length;i++){
				grid[0][i].shift();
				grid[1][i].shift();
			}
		}else{
			gridHeight++;
			view.u++;
			view.y++;
			view.touchY++;
			selectArea.top++;
			selectArea.bottom++;
			selectArea.pastTop++;
			selectArea.pastBottom++;
			view.shiftY++;
			for(let i=0;i<grid[0].length;i++){
				grid[0][i].unshift(base);
				grid[1][i].unshift(base);
			}
		}
	}
	//move lower edge
	if(-view.d<grid[s.g][0].length){
		gridHeight+=view.d;
		view.d=0;
		while(gridHeight>grid[1][0].length){
			for(let i=0;i<grid[1].length;i++){
				grid[0][i].push(base);
				grid[1][i].push(base);
			}
			hasChanged=4;
		}
		/*while(view.d!==0){
			if(view.d>0){
				view.d--;
				for(let i=0;i<grid[s.g].length;i++){
					grid[0][i].push(base);
					grid[1][i].push(base);
				}
			}else{
				view.d++;
				for(let i=0;i<grid[s.g].length;i++){
					grid[0][i].pop();
					grid[1][i].pop();
				}
			}
		}*/
	}
}

function update(){
	//coordinates of the touched cell
	let x=Math.floor(((mouse.x-300)/view.z+300)/cellWidth+view.x);
	let y=Math.floor(((mouse.y-200)/view.z+200)/cellWidth+view.y);
	//if in write mode
	if(mode===0){
		if(s.s!==0){
			//stretch the grid to include any new cells
			if(!document.getElementById("xloop").checked){
				xsides(0,gridHeight);
				if(x<gridMargin)view.l=x-gridMargin;
				if(x>=gridWidth-gridMargin)view.r=x+gridMargin+1-gridWidth;
				scaleGrid();
				x=Math.floor(((mouse.x-300)/view.z+300)/cellWidth+view.x);
			}
			if(!document.getElementById("yloop").checked){
				ysides(0,gridWidth);
				if(y<gridMargin)view.u=y-gridMargin;
				if(y>=gridHeight-gridMargin)view.d=y+gridMargin+1-gridHeight;
				scaleGrid();
				y=Math.floor(((mouse.y-200)/view.z+200)/cellWidth+view.y);
			}
		}
		if(s.e===-1){
			//if the finger is down
			if(s.s=== -1){
				s.p=0;
				hasChanged=5;
				if(grid[s.g][mod(x,gridWidth)][mod(y,gridHeight)]===0){
					//set cell state to live(highest state)
					s.s=1;
				}else{
					//otherwise set cell state to zero
					s.s=0;
				}
			}
		}else{
			s.s=s.e;
			s.p=0;
			hasChanged=5;
		}
		if((document.getElementById("xloop").checked||x>=0&&x<gridWidth)
		 &&(document.getElementById("yloop").checked||y>=0&&y<gridHeight)){
			//actually set the cell state
			grid[s.g][mod(x,gridWidth)][mod(y,gridHeight)]=s.s;
		}
		if(s.p===0)addMargin();
	//if in move mode
	}else if(mode===1){
		//if 2 fingers are touching the canvas
		if(mouse.x2&&mouse.pastX2){
			//otherwise scale the grid
			view.z=view.touchZ*Math.sqrt((mouse.x2-mouse.x)*(mouse.x2-mouse.x)
			                  +(mouse.y2-mouse.y)*(mouse.y2-mouse.y))/
			         Math.sqrt((mouse.pastX2-mouse.pastX)*(mouse.pastX2-mouse.pastX)
			                  +(mouse.pastY2-mouse.pastY)*(mouse.pastY2-mouse.pastY));

			if(view.z<0.2&&detailedCanvas===true){
				detailedCanvas=false;
				if(darkMode){
					canvas.style.backgroundColor="#2d2d2d";
				}else{
					canvas.style.backgroundColor="#e4e4e4";
				}
			}else if(view.z>0.2&&detailedCanvas===false){
				detailedCanvas=true;
				if(darkMode){
					canvas.style.backgroundColor="#222222";
				}else{
					canvas.style.backgroundColor="#f1f1f1";
				}
			}
		}else{
			switch(dragID){
				case 0:
					if(selectArea.a==2&&x>=selectArea.left&&x<selectArea.right&&y>=selectArea.top&&y<selectArea.bottom){
						dragID=5;
						selectArea.left=selectArea.pastLeft;
						selectArea.top=selectArea.pastTop;
						selectArea.right=selectArea.pastRight;
						selectArea.bottom=selectArea.pastBottom;
						mouse.pastX=mouse.x;
						mouse.pastY=mouse.y;
					}else{
						//select the grid edges if necessary
						if(document.getElementById("xloop").checked&&x>=0&&x<gridWidth&&y>=0&&y<gridHeight){
							if(x>=0&&x<gridWidth*0.1&&x<gridWidth*0.1/view.z){
								dragID=1;
								s.p=0;
							}else if(x>gridWidth*0.9-1&&x>gridWidth*(1-0.1/view.z)-1&&x<gridWidth){
								dragID=2;
								s.p=0;
							}
						}
						if(document.getElementById("yloop").checked&&x>=0&&x<gridWidth&&y>=0&&y<gridHeight){
							if(y>=0&&y<gridHeight*0.1&&y<gridHeight*0.1/view.z){
								dragID=3;
								s.p=0;
							}else if(y>gridHeight*0.9-1&&y>gridHeight*(1-0.1/view.z)-1&&y<gridHeight){
								dragID=4;
								s.p=0;
							}
						}
						view.l=0;
						view.r=0;
						view.u=0;
						view.d=0;
					}
					//translate the grid
					view.x=view.touchX+(mouse.pastX-mouse.x)/cellWidth/view.z;
					view.y=view.touchY+(mouse.pastY-mouse.y)/cellWidth/view.z;
				break;
				//drag left edge
				case 1:
					view.l=Math.floor(((mouse.x-300)/view.z+300)/cellWidth+view.x);
					ctx.fillRect(300-((view.x-view.l)*cellWidth+300)*view.z,200-(view.y*cellWidth+200)*view.z,cellWidth*view.z,(gridHeight)*view.z*cellWidth);
				break;
				//drag right edge
				case 2:
					view.r=Math.floor(((mouse.x-300)/view.z-300)/cellWidth+view.x+(600/cellWidth-gridWidth+1));
					ctx.fillRect(300-((view.x-view.r)*cellWidth-300+(600-(gridWidth-1)*cellWidth))*view.z,200-(view.y*cellWidth+200)*view.z,cellWidth*view.z,(gridHeight)*view.z*cellWidth);
				break;
				//drag upper edge
				case 3:
					view.u=Math.floor(((mouse.y-200)/view.z+200)/cellWidth+view.y);
					ctx.fillRect(300-(view.x*cellWidth+300)*view.z,200-((view.y-view.u)*cellWidth+200)*view.z,(gridWidth)*view.z*cellWidth,cellWidth*view.z);
				break;
				//drag downward edge
				case 4:
					view.d=Math.floor(((mouse.y-200)/view.z-200)/cellWidth+view.y+(400/cellWidth-gridHeight+1));
					ctx.fillRect(300-(view.x*cellWidth+300)*view.z,200-((view.y-view.d)*cellWidth-200+(400-(gridHeight-1)*cellWidth))*view.z,(gridWidth)*view.z*cellWidth,cellWidth*view.z);
				break;
				case 5:
					selectArea.left=selectArea.pastLeft+Math.floor((mouse.x-mouse.pastX)/view.z/cellWidth);
					selectArea.top=selectArea.pastTop+Math.floor((mouse.y-mouse.pastY)/view.z/cellWidth);
					selectArea.right=selectArea.pastRight+Math.floor((mouse.x-mouse.pastX)/view.z/cellWidth);
					selectArea.bottom=selectArea.pastBottom+Math.floor((mouse.y-mouse.pastY)/view.z/cellWidth);
				break;
			}
		}
	//if in select mode
	}else if(mode===2){
		//if there is no highlighted area make one
		if(selectArea.a===0){
			selectArea.a=1;
			dragID=-2;
			selectArea.left=x;
			selectArea.top=y;
			selectArea.right=x;
			selectArea.bottom=y;
			selectArea.pastLeft=x;
			selectArea.pastTop=y;
			selectArea.pastRight=x;
			selectArea.pastBottom=y;
		}else{
			if(dragID===0){
				//select the highlighted area if necessary
				if(x>=selectArea.left&&x<selectArea.right&&y>=selectArea.top&&y<selectArea.bottom){
					if(x===selectArea.left){
						dragID=-3;
						s.p=0;
					}else if(x===selectArea.right-1){
						dragID=3;
						s.p=0;
					}
					if(y=== selectArea.top){
						dragID+=1;
						s.p=0;
					}else if(y===selectArea.bottom-1){
						dragID-=1;
						s.p=0;
					}
				}
			}else{
				//drag bottom edge
				if(dragID===-4||dragID===-1||dragID===2){
					if(y<selectArea.pastTop){
						selectArea.top=y;
						selectArea.bottom=selectArea.pastTop;
					}else{
						selectArea.top=selectArea.pastTop;
						selectArea.bottom=y;
					}
					if(dragID===-1){
						if(x<selectArea.pastLeft)dragID=-4;
						if(x>selectArea.pastRight)dragID=2;
					}
				}
				//drag left edge
				if(dragID===-4||dragID===-3||dragID===-2){
					if(x<selectArea.pastRight){
						selectArea.left=x;
						selectArea.right=selectArea.pastRight;
					}else{
						selectArea.left=selectArea.pastRight;
						selectArea.right=x;
					}
					if(dragID===-3){
						if(y<selectArea.pastTop)dragID=-2;
						if(y>selectArea.pastBottom)dragID=-4;
					}
				}
				//drag top edge
				if(dragID===-2||dragID===1||dragID===4){
					if(y<selectArea.pastBottom){
						selectArea.top=y;
						selectArea.bottom=selectArea.pastBottom;
					}else{
						selectArea.top=selectArea.pastBottom;
						selectArea.bottom=y;
					}
					if(dragID===1){
						if(x<selectArea.pastLeft)dragID=-2;
						if(x>selectArea.pastRight)dragID=4;
					}
				}
				//drag right edge
				if(dragID===4||dragID===3||dragID===2){
					if(x<selectArea.pastLeft){
						selectArea.left=x;
						selectArea.right=selectArea.pastLeft;
					}else{
						selectArea.left=selectArea.pastLeft;
						selectArea.right=x;
					}
					if(dragID===3){
						if(y<selectArea.pastTop)dragID=4;
						if(y>selectArea.pastBottom)dragID=2;
					}
				}
			}
		}
	}
}

function gen(){
	s.t=Date.now();
	isActive=0;
	//
	let newgrid=1-s.g;

	if(document.getElementById("xloop").checked){
		margin.left=3;
		margin.right=gridWidth-3;
	}else{
		xsides(0,gridHeight);
		if(margin.right===0){
			margin.left=3;
			margin.right=gridWidth-3;
		}
	}
	if(document.getElementById("yloop").checked){
		margin.top=3;
		margin.bottom=gridHeight-3;
	}else{
		ysides(0,gridWidth);
		if(margin.bottom===0){
			margin.top=3;
			margin.bottom=gridHeight-3;
			s.p=0;
		}
	}
	//handles B0 rules
	if(base<=0){
		if(s.r[1][0]===1)base=1;
	}else if(base===1){
		if(s.r[0][255]===0){
			if(s.r[2]===2){
				base=0;
			}else{
				base=2;
			}
		}
	}else{
		base++;
		if(base>s.r[2]-1)base=0;
	}
	//update cell state
	for(let h=margin.left-3;h<margin.left-3+gridWidth;h++){
		for(let i=margin.top-3;i<margin.top-3+gridHeight;i++){
			if(h>=0&&i>=0&&h<gridWidth&&i<gridHeight){
				//reset the number of living neighbors a cell has
				let n=0,shift=[-1,1,-1,1];

				//increment the number of living neighbors for each neighbor
				if(h===0)           shift[0]=-1+gridWidth;
				if(h===gridWidth-1) shift[1]= 1-gridWidth;
				if(i===0)           shift[2]=-1+gridHeight;
				if(i===gridHeight-1)shift[3]= 1-gridHeight;


				if(grid[s.g][h+shift[1]][i+shift[3]]===1)n+=1;
				if(grid[s.g][h         ][i+shift[3]]===1)n+=2;
				if(grid[s.g][h+shift[0]][i+shift[3]]===1)n+=4;
				if(grid[s.g][h+shift[0]][i         ]===1)n+=8;
				if(grid[s.g][h+shift[0]][i+shift[2]]===1)n+=16;
				if(grid[s.g][h         ][i+shift[2]]===1)n+=32;
				if(grid[s.g][h+shift[1]][i+shift[2]]===1)n+=64;
				if(grid[s.g][h+shift[1]][i         ]===1)n+=128;
				//turn a dead cell into a live one if conditions are me
				if(grid[s.g][h][i]===0){
					if(s.r[1][n]===1){
						grid[newgrid][h+3-margin.left][i+3-margin.top]=1;
						isActive=1;
					}else{
						grid[newgrid][h+3-margin.left][i+3-margin.top]=0;
					}
				//turn a live cell into a dying one if conditions are met
				}else if(grid[s.g][h][i]===1){
					if(s.r[2]===2){
						grid[newgrid][h+3-margin.left][i+3-margin.top]=0;
					}else{
						grid[newgrid][h+3-margin.left][i+3-margin.top]=2;
					}
					if(s.r[0][n]===1){
						grid[newgrid][h+3-margin.left][i+3-margin.top]=1;
					}
					if(grid[newgrid][h+3-margin.left][i+3-margin.top]!==1)isActive=1;
				}else{
					if(grid[s.g][h][i]>=s.r[2]-1){
						grid[newgrid][h+3-margin.left][i+3-margin.top]=0;
					}else{
						//brings a dying cell closer to death
						grid[newgrid][h+3-margin.left][i+3-margin.top]=grid[s.g][h][i]+1;
					}
					isActive=1;
				}
			}else{
				grid[newgrid][h+3-margin.left][i+3-margin.top]=base;
			}
		}
	}
	if(isActive===1){
		s.g=newgrid;
		//move grid according to how the cells were offset
		view.x+=3-margin.left;
		view.y+=3-margin.top;
		view.touchX+=3-margin.left;
		view.touchY+=3-margin.top;
		view.shiftX+=3-margin.left;
		view.shiftY+=3-margin.top;
		selectArea.left+=3-margin.left;
		selectArea.top+=3-margin.top;
		selectArea.right+=3-margin.left;
		selectArea.bottom+=3-margin.top;
		selectArea.pastLeft+=3-margin.left;
		selectArea.pastTop+=3-margin.top;
		selectArea.pastRight+=3-margin.left;
		selectArea.pastBottom+=3-margin.top;

		//adjust right and bottom edges
		view.r=margin.right-gridWidth-margin.left+6;
		view.d=margin.bottom-gridHeight-margin.top+6;

		scaleGrid();


		genCount++;
		document.getElementById("gens").innerHTML="Generation "+genCount+".";
		if(startIndex===0)startIndex=currentIndex;
		done();
	}else{
		//pause if the grid is inactive
		if(s.o.length===0)s.p=0;
	}
	if(document.getElementById("log").checked===true){
		log.amount++
		if(selectArea.left>0&&selectArea.top>0&&grid[s.g][selectArea.left][selectArea.top]===1){
			document.getElementById("rle").value+=log.amount+",";
			log.amount=0;
		}
	}
	//record that a generation was run
	if(s.p<0)s.p++;
}

//function which renders graphics to the canvas
function render(){
	//grid line offsets
	let x=mod(view.x,1), y=mod(view.y,1), color=0;

	//clear screen
	ctx.clearRect(0,0,600,400);
	//set line width
	//ctx.lineWidth=1;
	if(darkMode){
		ctx.fillStyle="#fff";
	}else{
		ctx.fillStyle="#000";
	}

	ctx.font = "15px Arial";
	ctx.fillText(ship[1].stage+" "+ship[1].period+" "+ship[1].width+" "+ship[2].period+" "+ship[3].period,10,30);

	//draw selected area
	if(selectArea.a>0){
		if(mode===2&&dragID!==0){
			if(darkMode){
				ctx.fillStyle="#555";
			}else{
				ctx.fillStyle="#999";
			}
		}else{
			if(darkMode){
				ctx.fillStyle="#333";
			}else{
				ctx.fillStyle="#ccc";
			}
		}
		ctx.fillRect(300-((view.x-selectArea.left)*cellWidth+300)*view.z,200-((view.y-selectArea.top)*cellWidth+200)*view.z,(selectArea.right-selectArea.left)*view.z*cellWidth-1,(selectArea.bottom-selectArea.top)*view.z*cellWidth-1);
	}

	//for each cell
	for(let h=0;h<600/cellWidth/view.z+1;h++){
		for(let i=0;i<400/cellWidth/view.z+1;i++){
			//draw a square if the cell's state is not 0 and within the sim area
			if(G(h,i)!==0&&(document.getElementById("xloop").checked||h+view.x+(300-300/view.z)/cellWidth>=0&&h+view.x+(300-300/view.z)/cellWidth<gridWidth)
			               &&(document.getElementById("yloop").checked||i+view.y+(200-200/view.z)/cellWidth>=0&&i+view.y+(200-200/view.z)/cellWidth<gridHeight)){
				//find the cell's color depending on the state
				if(G(h,i)===1){
					if(darkMode){
						color=240;
					}else{
						color=0;
					}
				}else{
					if(darkMode){
						color=208/s.r[2]*(s.r[2]-G(h,i)+1)+32;
					}else{
						color=255/s.r[2]*(G(h,i)-1);
					}
				}
				ctx.fillStyle="rgb("+color+","+color+","+color+")";
				//set the color
				ctx.fillRect((300/view.z-view.x*cellWidth+Math.floor(round(view.x-300/cellWidth/view.z))*cellWidth)*view.z+h*cellWidth*view.z,(200/view.z-view.y*cellWidth+Math.floor(round(view.y-200/cellWidth/view.z))*cellWidth)*view.z+i*cellWidth*view.z,cellWidth*view.z,cellWidth*view.z);
			}
		}
	}

	if(selectArea.a===2){
		for(let h=0;h<clipboard.length;h++){
			for(let i=0;i<clipboard[0].length;i++){
				if(clipboard[h][i]>0){
					//find the cell's color depending on the state
					if(clipboard[h][i]===1){
						if(darkMode){
							color=240;
						}else{
							color=0;
						}
					}else{
						if(darkMode){
							color=208/s.r[2]*(s.r[2]-clipboard[h][i]+1)+32;
						}else{
							color=255/s.r[2]*(clipboard[h][i]-1);
						}
					}
					//set the color
					ctx.fillStyle="rgba("+color+","+color+","+color+",0.8)";
					ctx.fillRect(300-(300+view.x*cellWidth)*view.z+(selectArea.left+h)*cellWidth*view.z,200-(200+view.y*cellWidth)*view.z+(selectArea.top+i)*cellWidth*view.z,cellWidth*view.z,cellWidth*view.z);
				}
			}
		}
	}
	ctx.fillStyle="rgba(0,0,0,0.5)";
	if(mode===1)switch(dragID){
		//draw left edge
		case 1:
		ctx.fillRect(300-((view.x-view.l)*cellWidth+300)*view.z,200-(view.y*cellWidth+200)*view.z,cellWidth*view.z,(gridHeight)*view.z*cellWidth);
		break;
		//draw right edge
		case 2:
		ctx.fillRect(300-((view.x-view.r)*cellWidth-300+(600-(gridWidth-1)*cellWidth))*view.z,200-(view.y*cellWidth+200)*view.z,cellWidth*view.z,(gridHeight)*view.z*cellWidth);
		break;
		//drae upper edge
		case 3:
		ctx.fillRect(300-(view.x*cellWidth+300)*view.z,200-((view.y-view.u)*cellWidth+200)*view.z,(gridWidth)*view.z*cellWidth,cellWidth*view.z);
		break;
		//draw downward edge
		case 4:
		ctx.fillRect(300-(view.x*cellWidth+300)*view.z,200-((view.y-view.d)*cellWidth-200+(400-(gridHeight-1)*cellWidth))*view.z,(gridWidth)*view.z*cellWidth,cellWidth*view.z);
		break;
	}
	//if the toggle grid variable is true
	if(gridLines){
		if(darkMode){
		ctx.strokeStyle="#333";
		}else{
		ctx.strokeStyle="#bbb";
		}
		ctx.strokeRect(300-(view.x*cellWidth+300)*view.z,200-(view.y*cellWidth+200)*view.z,grid[0].length*view.z*cellWidth-1,grid[0][0].length*view.z*cellWidth-1);
		//draw a grid
		if(darkMode){
			ctx.strokeStyle="#999";
		}else{
			ctx.strokeStyle="#000000";
		}
		if(detailedCanvas===true){
			ctx.lineWidth=0.5*view.z;
			ctx.beginPath();
			//draw horizonal lines
			for(let h= -Math.floor(300/cellWidth/view.z);h<300/cellWidth/view.z+1;h++){
				ctx.moveTo(300+(h-x)*view.z*cellWidth,0);
				ctx.lineTo(300+(h-x)*view.z*cellWidth,400);
			}
			//draw virtical lines
			for(let h= -Math.floor(200/cellWidth/view.z);h<200/cellWidth/view.z+1;h++){
				ctx.moveTo(0  ,200+(h-y)*cellWidth*view.z);
				ctx.lineTo(600,200+(h-y)*cellWidth*view.z);
			}
			ctx.stroke();
		}
		ctx.lineWidth=3*view.z;
		ctx.strokeRect(300-(view.x*cellWidth+300)*view.z,200-(view.y*cellWidth+200)*view.z,gridWidth*view.z*cellWidth-1,gridHeight*view.z*cellWidth-1);
	}
	//draw a rectangle around the pattern to be pasted.
	if(selectArea.a>0){
		ctx.lineWidth=3*view.z;
		ctx.strokeStyle="#666666";
		ctx.strokeRect(300-((view.x-selectArea.left)*cellWidth+300)*view.z,200-((view.y-selectArea.top)*cellWidth+200)*view.z,(selectArea.right-selectArea.left)*view.z*cellWidth-1,(selectArea.bottom-selectArea.top)*view.z*cellWidth-1);
	}
}

function scaleCanvas(){
	WW=document.documentElement.clientWidth;
	WH=window.innerHeight;
	let unit=Math.min(WW,WH*1.5)/100;
	document.getElementById("content").style.padding=3*unit+"px";
	if(WW<WH*1.5){
		CH=(WW-unit*6)/1.5;
		CW=WW-unit*6;
	}else{
		CH=WH-unit*6;
		CW=(WH-unit*6)*1.5;
	}
	canvas.width =CW;
	canvas.height=CH;
	ctx.scale(CH/400,CH/400);
	if(true||WW-CW-unit*6>300){
		document.getElementById("top").style.width="300px";
	}else{
		document.getElementById("top").style.width=(WW-10)+"px";
	}
}

function drawPattern(startPoint,rle,xPosition,yPosition){
	let repeat=[],xStartPosition=xPosition;
	for(let h=startPoint;h<rle.length;h++){
		if(rle[h]==="!")break;
		if(isNaN(rle[h])||rle[h]===" "){
			repeat=parseInt(repeat.join(""),10);

			if(isNaN(repeat)){
				repeat=1;
			}

			for(let i=0;i<repeat;i++){
				//dead cell if conditions are met
				if(rle[h]==="b"||rle[h]==="."){
					grid[s.g][xPosition][yPosition]=0;
					xPosition++;
				//newline if conditions met
				}else if(rle[h]==="$"){
					xPosition=xStartPosition;
					yPosition++;
				//else live cell
				}else{
					if(s.r[2]===2||rle[h]==="o"){
						grid[s.g][xPosition][yPosition]=1;
					}else if(rle[h].charCodeAt(0)>64&&rle[h].charCodeAt(0)<91){
						grid[s.g][xPosition][yPosition]=rle[h].charCodeAt(0)-64;
					}
					xPosition++;
				}
			}
			repeat=[];
		}else{
			repeat.push(rle[h]);
		}
	}
}

//import data from the RLE(dimensions, toroidal grids, pattern, etc...)
function importRLE(){
	let text=document.getElementById("rle").value.split(""),
	    textIndex=0,
	    number=[],
	    pattern=[],
	    importHeader=true;
	if(arguments.length>0){
		importHeader=false;
		text=arguments[0];
	}else{
		for(let h=0;h<text.length;h++){
			//console.log(text[h]);
			if(textIndex!==-1){
				//find and ignore comments
				if(text[h]==="#")textIndex=-1;
				//transcribe objects dimensions
				if(text[h]==="x")textIndex=-2;
				if(text[h]==="y")textIndex=-3;
			}else{
				//comment ends when line ends
				if(text[h]==="\n")textIndex=0;
			}
			//if the program is reading the dimensions
			if(textIndex<-1){
				//if the current charatcer is not a number
				if(isNaN(text[h])||text[h]===" "||text[h]==="\n"){
					//if the program has just finished reading a number
					if(textIndex<-3){
						//parse the number into an int
						number=parseInt(number.join(""),10);
						//set the width or height to the saved number
						if(textIndex===-4){
							textIndex=1;
							view.r=number+6-gridWidth;
							number=[];
						}
						if(textIndex===-5){
							textIndex=h;
							view.d=number+6-gridHeight;
							break;
						}
					}
				}else{
					//if the current character is a number, append it to the stored number
					if(textIndex>=-3)textIndex-=2;
					number[number.length]=text[h];
				}
			}
		}
	}
	//transcribe rule
	if(text[textIndex+1]==="r"||text[textIndex+2]==="r"){
		pattern=[];
		for(let h=textIndex;h<text.length;h++){
			if(text[h]==="\n"||text[h]===":"){
				textIndex=h;
				break;
			}else{
				if(textIndex===-1){
					if(text[h]===" "){
						if(pattern.length>0){
							textIndex=h;
							break;
						}
					}else{
						pattern.push(text[h]);
					}
				}
			}
			if(text[h]==="="){
				textIndex=-1;
			}
		}
		document.getElementById("rule").value=pattern.join("");
		rule(pattern.join(""));
	}else{
		document.getElementById("rule").value="b3/s23";
		rule("b3/s23");
	}
	//transcribe info for a toroidal grid
	if(text[textIndex]===":"&&text[textIndex+1]==="T"){
		pattern=[];
		if(text[textIndex+2]==="0"){
			document.getElementById("xloop").checked=false;
			textIndex+=4;
		}else{
			document.getElementById("xloop").checked=true;
			for(let h=textIndex+2;h<text.length;h++){
				if(isNaN(text[h])){
					view.r=parseInt(pattern.join(""))-gridWidth;
					pattern=[];
					textIndex=h+1;
					break;
				}else{
					pattern.push(text[h]);
				}
			}
		}
		if(text[textIndex]==="0"){
			document.getElementById("yloop").checked=false;
			textIndex++;
		}else{
			document.getElementById("yloop").checked=true;
			for(let h=textIndex;h<text.length;h++){
				if(isNaN(text[h])){
					view.d=parseInt(pattern.join(""))-gridHeight;
					pattern=[];
					textIndex=h-2;
					break;
				}else{
					pattern.push(text[h]);
				}
			}
		}
	}
	scaleGrid();
	//transcribe pattern
	base=0;
	clearGrid(0,gridWidth,gridHeight,0);
	let xloc=document.getElementById("xloop").checked?0:3;
	let yloc=document.getElementById("yloop").checked?0:3;
	drawPattern(textIndex,text,xloc,yloc);
	s.p=0;
	startIndex=0;
	if(importHeader){
		addMargin();
		fitView();
		done();
	}
}

function readPattern(top,right,bottom,left){
	let pattern=[];
	for(let i=top;i<bottom;i++){
		let repeat=1;
		for(let h=left;h<right;h++){
			//count n same cells, jump n back, push n, jump forward n
			if(grid[s.g][h+1]&&grid[s.g][h+1][i]===grid[s.g][h][i]){
				repeat++;

			}else{
				if(repeat!==1){
					pattern.push(repeat);
					repeat=1;
				}
				if(s.r[2]===2){
					if(grid[s.g][h][i]===0){
						pattern.push("b");
					}else{
						pattern.push("o");
					}
				}else{
					if(grid[s.g][h][i]===0){
						pattern.push(".");
					}else{
						pattern.push(String.fromCharCode(grid[s.g][h][i]+64));
					}
				}
			}
		}
		if(pattern[pattern.length-1]==="$"){
			if(isNaN(pattern[pattern.length-2])){
				pattern[pattern.length-1]=2;
				pattern.push("$");
			}else{
				pattern[pattern.length-2]=pattern[pattern.length-2]+1;
			}
		}else{
			pattern.push("$");
		}
	}
	pattern[pattern.length-1]="!";
	return pattern.join("");
}

function exportRLE(){
	let exportAsOneLine=false,text="";
	if(arguments.length>0){
		exportAsOneLine=true;
		if(document.getElementById("rle").value!=="")text+="\n";
		text+="#pattern has a period of "+arguments[0]+"\n";
	}else{
		document.getElementById("rle").value="";
	}
	//find distance between pattern and border
	xsides(0,gridHeight);
	ysides(0,gridWidth);
	let torus=[];
	if(document.getElementById("xloop").checked||document.getElementById("yloop").checked){
		torus=[":T","0",",","0"];
		if(document.getElementById("xloop").checked){
			torus[1]=gridWidth;
			margin.left=0;
			margin.right=gridWidth;
		}
		if(document.getElementById("yloop").checked){
			torus[3]=gridHeight;
			margin.top=0;
			margin.bottom=gridHeight;
		}
	}
	//unparse data into the rle header
	text+="x = "+(margin.right-margin.left)+", y = "+(margin.bottom-margin.top)+", rule = "+rulestring;

	text+=torus.join("");

	let pattern=readPattern(margin.top,margin.right,margin.bottom,margin.left).split("");
	if(exportAsOneLine===false){
		for(let h=0;h<pattern.length;h++){
			if(h%70===0){
				i=0;
				while(i<70&&!isNaN(pattern[h-i-1]))i++;
				pattern.splice(h-i,0,"\n");
			}
		}
	}else{
		text+="\n";
	}
	text+=pattern.join("");
	return text;
}

function clearRLE(){
	document.getElementById("rle").value="";
}

function copyRLE(){
	document.getElementById("rle").select();
	document.getElementById("rle").setSelectionRange(0, 99999);
	document.execCommand("copy");
}

//input rules
function rule(ruleText){
	if(ruleText===1)ruleText=document.getElementById("rule").value;
	if(!ruleText)ruleText=["B","3","/","S","2","3"];

	ruleText=ruleText.split("");
	let readMode=0,transitionNumber=-1,isBirthDone=false,isSurvivalDone=false;
	rulestring=[[],[],[]];

	for(let h=0;h<ruleText.length;h++){
		if(ruleText[h]==="s"||ruleText[h]==="S"){
			readMode=0;
			transitionNumber=-1;
			isSurvivalDone=true;
		}else if(ruleText[h]==="b"||ruleText[h]==="B"){
			readMode=1;
			transitionNumber=-1;
			isBirthDone=true;
		}else if(ruleText[h]==="g"||ruleText[h]==="G"||ruleText[h]==="C"){
			readMode=2;
			transitionNumber=-1;
		}else if(ruleText[h]==="/"||ruleText[h]==="_"){
			if(isBirthDone===false){
				isSurvivalDone===true
			}
			readMode++;
			if(isBirthDone===true&&isSurvivalDone===true)readMode=2;
			transitionNumber=-1;
			console.log("h"+readMode);
		}else{
			if(isNaN(ruleText[h])){
				if(transitionNumber===-1){
					//error
				}else{
					rulestring[readMode].push(ruleText[h]);
				}
			}else{
				transitionNumber=parseInt(ruleText[h],10);
				rulestring[readMode].push(ruleText[h]);
			}
		}
	}

	if(rulestring[2].length===0){
		rulestring[2]=2;
	}else{
		rulestring[2]=parseInt(rulestring[2].join(""),10);
	}

	//empty arrays which will set how the cell states update
	s.r=[[],[],rulestring[2]];

	drawState(s.e);

	//for all 255 possible states of the 8 neighbors
	for(let h=0;h<256;h++){
		//for both birth and survival states
		for(let i=0;i<2;i++){
			//assume that the cell will be dead
			s.r[i].push(0);
			//flag for
			let abc=[-1,-1];
			//for each character in the rulestring
			for(let j=0;j<rulestring[i].length;j++){
				if(abc[0]===-1){
					if(rulestring[i][j]==ruleMap[h][0]){
						abc[0]=rulestring[i][j];
						s.r[i][h]=1;
					}
				}else{
					if(isNaN(rulestring[i][j])){
						if(abc[1]===-1){
							if(rulestring[i][j]==="-"){
								abc[1]=0;
								j++;
							}else{
								abc[1]=1;
								s.r[i][h]=0;
							}
						}
						//is the transition from the map present in the rulestring
						if(rulestring[i][j]===ruleMap[h][1]){
							if(abc[1]===1){
								s.r[i][h]=1;
							}else{
								s.r[i][h]=0;
							}
						}
					}else{
						break;
					}
				}
			}
		}
	}
	rulestring=clean(ruleText);
}

function clean(dirtyString){
	let cleanString=dirtyString,
	    number=0,
	    numIndex=0,
	    transitionLength=0,
	    searchIndex=0,
	    newString=[],
	    table=[["-"],
	           ["c","e"],
	           ["a","c","e","i","k","n"],
	           ["a","c","e","i","j","k","n","q","r","y"],
	           ["a","c","e","i","j","k","n","q","r","t","w","y","z"],
	           ["a","c","e","i","j","k","n","q","r","y"],
	           ["a","c","e","i","k","n"],
	           ["c","e"],
	           ["-"]],
	    buffer="";
	for(;searchIndex<=cleanString.length;searchIndex++){
		if(isNaN(cleanString[searchIndex])&&searchIndex<cleanString.length){
			 if(cleanString[searchIndex]!=="/"&&
			    cleanString[searchIndex]!=="s"&&
			    cleanString[searchIndex]!=="b"&&
			    cleanString[searchIndex]!=="g"&&
			    cleanString[searchIndex]!=="S"&&
			    cleanString[searchIndex]!=="B"&&
			    cleanString[searchIndex]!=="G"){
			    console.log(number+" "+table[number]+" "+cleanString[searchIndex]);
			    if(cleanString[searchIndex]!=="-"&&
			       table[number].indexOf(cleanString[searchIndex])===-1){
					cleanString.splice(searchIndex,1);
				}else{
					transitionLength++;
					newString.push(cleanString[searchIndex]);
				}
			}
		}else{
			if(transitionLength>table[number].length/2){
				if(newString[0]==="-"){
					if(transitionLength-1===table[number].length){
						newString=[];
						cleanString.splice(numIndex,transitionLength+1);
						searchIndex+=newString.length-transitionLength-1;
					}else{
						if(number!==4||transitionLength!==7){
							for(let tableIndex = 0; tableIndex<table[number].length;tableIndex++){
								if(newString.indexOf(table[number][tableIndex])===-1){
									newString.push(table[number][tableIndex]);
								}
							}
							newString.splice(0,transitionLength);
							//console.log(newString);
							cleanString.splice(numIndex+1,transitionLength,...newString);
							searchIndex+=newString.length-transitionLength;
						}
					}
					//console.log(cleanString);
				}else{
					if(transitionLength===table[number].length){
						newString=[];
					}else{
						newString.push("-");
						for(let tableIndex = 0; tableIndex<table[number].length;tableIndex++){
							if(newString.indexOf(table[number][tableIndex])===-1){
								newString.push(table[number][tableIndex]);
							}
						}
						newString.splice(0,transitionLength);
						//console.log(newString);
					}
					cleanString.splice(numIndex+1,transitionLength,...newString);
					//console.log(cleanString);
					searchIndex+=newString.length-transitionLength;
				}
			}
			if(searchIndex<cleanString.length)number=parseInt(cleanString[searchIndex],10);
			//console.log(searchIndex+"number"+number);
			numIndex=searchIndex;
			transitionLength=0;
			newString=[];
		}
	}
	searchIndex=0;
	while(numIndex+1<cleanString.length&&searchIndex+1<cleanString.length){
		if(isNaN(cleanString[numIndex])){
			if(isNaN(cleanString[searchIndex+1])&&cleanString[searchIndex+1]!=="/"){
				if(cleanString[searchIndex].charCodeAt(0)>cleanString[searchIndex+1].charCodeAt(0)){
					buffer=cleanString[searchIndex+1];
					cleanString[searchIndex+1]=cleanString[searchIndex];
					cleanString[searchIndex]=buffer;
					searchIndex--;
				}else{
					numIndex++;
					searchIndex=numIndex;
				}
			}else{
				numIndex++;
				searchIndex=numIndex;
			}
		}else{
			number=cleanString[numIndex];
			numIndex++;
			searchIndex=numIndex;
		}
	}
	return cleanString.join("");
}

function main(){
	if(WW<document.documentElement.clientWidth
	 ||WH<=window.innerHeight
	 &&WH>=window.innerHeight+40)scaleCanvas();
	//register key inputs
	keyInput();
	//register mouse and touch inputs
	if(mouse.x&&mouse.pastX)update();
	//run a generation of the simulation
	if(s.p!==0){
		gen();
		//restarts the simulation with a random soup once the grid is periodic
		if(document.getElementById("search").checked)search();
		if(document.getElementById("catch").checked)catchShips();
	}
	//draw the simulation
	if(s.p===0||(genCount-stepStart)%stepSize===0)render();
	if(s.p!==0||s.k[0])requestAnimationFrame(main);
}
requestAnimationFrame(main);

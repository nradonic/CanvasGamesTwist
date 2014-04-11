// CanvasGames - Annealing of colors - swapping two cell values if it is a better color match

var screenDraw = 0;
var screenDelay=1;
var gridSize = 4;
var gridSize2 = gridSize*gridSize;
var serviceFlag = true; // set when operating parameters change
var Pause = false; // Pause Play button state
var ColorSpace = 2;
var ColorScale = 255;
var maxTest = 3*255*255;

function rand1(){
	return Math.floor(Math.random()*ColorSpace)*ColorScale;
}

function randGS(gridSizeX){
	var a = Math.floor(Math.random()*gridSizeX);
	return a;
}

function gridCell(rc,gc,bc){this.r=rc,this.g=gc,this.b=bc};

var dataGrid = new Array(gridSize2);

function OnChange()
{
	var dropdownSize = document.getElementById("select1");
    var dropdownColor = document.getElementById("select2");
    //var dropdownDelay = document.getElementById("select3");

    gridSize = parseInt(dropdownSize.options[dropdownSize.selectedIndex].value);
    gridSize2 = gridSize*gridSize;   
    dataGrid = new Array(gridSize2);
    
    ColorSpace = parseInt(dropdownColor.options[dropdownColor.selectedIndex].value);
    ColorScale = Math.floor(255/(ColorSpace-1));
    
    //screenDelay = parseInt(dropdownDelay.options[dropdownDelay.selectedIndex].value);
    cycleDelay();
    
    for(i=0;i<gridSize2;i++){dataGrid[i]=new gridCell(rand1(),rand1(),rand1());} 
    
    screenDraw = 0;
    serviceFlag = true;
    
    return true;
}

function drawCanvas1(){
	var c=document.getElementById("drawHere");
	var ctx=c.getContext("2d");
	var myScreen = 800;
	var myScreen2 = myScreen*myScreen*4;
	var myScreen4 = myScreen*4;
	var scaler =myScreen/gridSize; 
	ctx.beginPath();
	var squareSide = myScreen/gridSize;
	for(var i = 0; i< gridSize2;i++){
		var squareRow = Math.floor(i/gridSize);
		var squareCol = Math.floor(i%gridSize);

		var y = squareRow*squareSide;
		var x = squareCol*squareSide;
		
		var t='rgba('+dataGrid[i].r+','+ dataGrid[i].g+','+dataGrid[i].b+',255)';
		ctx.fillStyle = t;
		ctx.fillRect(x,y,squareSide,squareSide);
    }
	ctx.stroke();
};

function diffSQ(ST1,ST2){
		var rd = dataGrid[ST1].r-dataGrid[ST2].r;
		var gd = dataGrid[ST1].g-dataGrid[ST2].g;
		var bd = dataGrid[ST1].b-dataGrid[ST2].b;
		return maxTest - (rd*rd*1.1+gd*gd+bd*bd*.9);
	}

function fitColor(i1,j1,i2,j2){
	var ST1 = i1*gridSize+j1;
	var ST2 = i2*gridSize+j2;
	var edge = gridSize-1;
	
	var total = 0;
	var cnt = 0;
	if(j2!== 0){total = diffSQ(ST1, ST2-1); cnt++;}
	if(i2!==0 && j2!==0){total += diffSQ(ST1,ST2-gridSize-1)/2; cnt++;}//2;
	if(i2!==0){total += diffSQ(ST1,ST2-gridSize); cnt++;}
	if(i2!==0 && j2!==edge){total += diffSQ(ST1,ST2-gridSize+1)/2; cnt++;}///2;
	if(j2!==edge){total += diffSQ(ST1,ST2+1); cnt++;}
	if(i2!==edge && j2!==0){total += diffSQ(ST1,ST2+gridSize-1)/2; cnt++;}//2;
	if(i2!==edge){total += diffSQ(ST1,ST2+gridSize); cnt++;}
	if(i2!==edge && j2!==edge){total += diffSQ(ST1,ST2+gridSize+1)/2; cnt++;}//2;
	return total/cnt;
}

function trade(i1,j1,i2,j2){
	var one = i1*gridSize+j1;
	var two = i2*gridSize+j2;
	
	var r = dataGrid[one].r;
	var g = dataGrid[one].g;
	var b = dataGrid[one].b;
	
	dataGrid[one].r=dataGrid[two].r;
	dataGrid[one].g=dataGrid[two].g;
	dataGrid[one].b=dataGrid[two].b;
	
	dataGrid[two].r=r;
	dataGrid[two].g=g;
	dataGrid[two].b=b;
}	
	
function testSwapSpaces(i1,j1,i2,j2){
	var OneAtOne = fitColor(i1,j1,i1,j1);
	var TwoAtTwo = fitColor(i2,j2,i2,j2);
	var OneAtTwo = fitColor(i1,j1,i2,j2);
	var TwoAtOne = fitColor(i2,j2,i1,j1);
	if(Math.max(OneAtOne,TwoAtTwo)<Math.max(OneAtTwo,TwoAtOne)){trade(i1,j1,i2,j2);}
}	

function middleSwap(){
	for (i=0;i<gridSize;i++){
		var iIndex1 = randGS(gridSize);
		var jIndex1 = randGS(gridSize);
		var iIndex2 = randGS(gridSize);
		var jIndex2 = randGS(gridSize);
		if(iIndex1!==iIndex2 && jIndex1!==jIndex2){	testSwapSpaces(iIndex1,jIndex1,iIndex2,jIndex2);}
	 }
}

function smooth(){
	screenDraw++;
	document.getElementById("screenDraw").innerHTML=screenDraw.toFixed(0);
	middleSwap();

}

function cycle(myVarr){
	smooth();
	drawCanvas1(); 
	if(serviceFlag){
		clearInterval(myVarr);
		start();
	}
}

var myVar;

function start(){
	myVar=setInterval(function(){cycle(myVar)},screenDelay);
}

function stop(){clearInterval(myVar);}

function cycleDelay(){
	var dropdownDelay = document.getElementById("select3");
	screenDelay = parseInt(dropdownDelay.options[dropdownDelay.selectedIndex].value);
	serviceFlag = true;
}

function PausePlay(){
	Pause = !Pause;
	if(Pause){stop(); document.getElementById("PausePlay").innerHTML="Play";}
	if(!Pause){start();	document.getElementById("PausePlay").innerHTML="Pause";}
}

OnChange();
drawCanvas1();
start();
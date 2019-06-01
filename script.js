const frn = new FastReadingEngine();

const wordDivs = [
	document.getElementById("left"),
	document.getElementById("middle"),
	document.getElementById("right"),
];



function wordPartsToScreen(wordParts){
	for (let i = 0; i < wordDivs.length; i++){
		wordDivs[i].innerHTML = wordParts[i];
	}
}

function handleVisibilityChange(){
	if (document.hidden){
		pauseReading();
	} else {
		// Maybe something, idk
	}
}

document.onvisilbilitychange = handleVisibilityChange;


// Set up key controls
const controlsPressed = {
	speedUp: false,
	slowDown: false,
	stepForward: false,
	stepBackward: false,
	togglePause: false
};

const controlsFunctions = {
	speedUp: speedUpFunc,
	slowDown: slowDownFunc,
	stepForward: stepForwardFunc,
	stepBackward: stepBackwardFunc,
	togglePause: togglePauseFunc
};

const keyToControlMap = {
	"ArrowRight": "stepForward",
	"ArrowLeft" : "stepBackward",
	"ArrowUp"   : "speedUp",
	"ArrowDown" : "slowDown",
	" "         : "togglePause"
};

document.onkeydown = function(e){
	const key = e.key;
	if (keyToControlMap[key]){
		controlsPressed[keyToControlMap[key]] = true;
	}
};

document.onkeyup = function(e){
	const key = e.key;
	if (keyToControlMap[key]){
		controlsPressed[keyToControlMap[key]] = false;
	}
};

function controlLoop(){
	// execute all pressed controls
	for (let control in controlsPressed){
		if (controlsPressed[control]){
			controlsFunctions[control]();
			controlsPressed[control] = false;
		}
	}

	requestAnimationFrame(controlLoop);
}
controlLoop();

function speedUpFunc(){
	console.log("speed up");
	frn.setWPM(frn.getWPM() + 5);
}

function slowDownFunc(){
	console.log("slow down");
	frn.setWPM(frn.getWPM() - 5);
}

function stepForwardFunc(){
	console.log("step forward");
	frn.step();
	wordPartsToScreen(frn.getWordParts());
	pauseReading();
}

function stepBackwardFunc(){
	console.log("step backward");
	frn.stepBackward();
	wordPartsToScreen(frn.getWordParts());
	pauseReading();
}

let paused = true;
function togglePauseFunc(){
	console.log("toggle pause");
	if (paused){
		unpauseReading();
	} else {
		pauseReading();
	}
}
function pauseReading(){
	paused = true;
	stopReadLoop();
}
function unpauseReading(){
	paused = false;
	readLoop();
}
/*  */

// Highlighted text area
const highlightedTextArea = document.getElementById("highlightedTextArea");
function loadHighlightedText(arr){
	for (let i = 0; i < arr.length; i++){
		const el = document.createElement("span");
		el.onclick = gotoWordOnClick;
		el.dataset.index = i;
		el.innerText = arr[i] + " ";
		highlightedTextArea.append(el);
	}
}

function gotoWordOnClick(el){
	const word = el.target;
	const index = word.dataset.index;
	frn.goToIndex(index);
	wordPartsToScreen(frn.getWordParts());
	pauseReading();
	console.log(index);
}
/* */


// Reading loop
let tmID = 0;
function readLoop(){
	wordPartsToScreen(frn.getWordParts());
	const wait = frn.getWaitDuration();

	if (frn.step()){
		tmID = window.setTimeout(readLoop, wait);
	}
}

function stopReadLoop(){
	window.clearTimeout(tmID);
}
/* */


// Set up buttons
const btn_loadText = document.getElementById("btn_loadText");
const textInput = document.getElementById("textInput");
btn_loadText.onclick = function(){
	frn.setText(textInput.value);
	loadHighlightedText(frn.getTextList());
}
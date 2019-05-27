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
		}
	}

	// undo "pause" so we aren't constantly toggling
	if (controlsPressed.togglePause) {
		controlsPressed.togglePause = false;
	}
}

function speedUpFunc(){
	frn.setWPM(frn.getWPM() + 5);
}

function slowDownFunc(){
	frn.setWPM(frn.getWPM() - 5);
}

function stepForwardFunc(){
	frn.step();
}

function stepBackwardFunc(){
	frn.stepBackward();
}

let paused = true;
function togglePauseFunc(){
	if (paused){
		paused = false;
		readLoop();
	} else {
		pause = true;
		stopReadLoop();
	}
}

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
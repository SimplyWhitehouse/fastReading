const frn = new FastReadingEngine();

const wordDivs = [
	document.getElementById("left"),
	document.getElementById("middle"),
	document.getElementById("right"),
];

let tmID = 0;

function wordPartsToScreen(wordParts){
	for (let i = 0; i < wordDivs.length; i++){
		wordDivs[i].innerText = wordParts[i];
	}
}

function readLoop(){
	wordPartsToScreen(frn.getWordParts());
	const wait = frn.getWaitDuration();

	if (frn.step()){
		tmID = window.setTimeout(readLoop, wait);
	}
}

function pauseReading(){
	window.clearTimeout(tmID);
}

function handleVisibilityChange(){
	if (document.hidden){
		pauseReading();
	} else {
		// Maybe something, idk
	}
}

document.onvisilbilitychange = handleVisibilityChange;
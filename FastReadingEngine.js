function FastReadingEngine(options){
	// The list of all available words
	let strList = [];

	const textSplitRegex = /\s+/;
	const puncuationRegex = /\.,?!/;

	// The current index of the word we are looking at
	let i = 0;

	// The current word we are looking at, split into three parts
	let wordParts = ["", "", ""];
	// The current word
	let word = "";

	const minWPM = 0; // Has to be > 0
	const maxWPM = 3600; // Browser refresh at 60fps. (60 frames/s) * (1 words/frame) * (60 s/min) = 3,600 words/min
	const defaultWPM = 300; // Just faster than the average, 220 WPM 
	let WPM = defaultWPM;

	let baseDuration = 0;
	const puncuationModifier = 1.5; // Multiply baseDuration 

	/** Sets the list of words and resets the index to 0;
	*/
	this.setText = function(text){
		strList = text.split(textSplitRegex);
		this.goToStart();
	}

	this.setWPM = function(newWPM){
		WPM = newWPM < minWPM ? minWPM : newWPM > maxWPM ? maxWPM : newWPM;
		updateBaseDuration();
	}

	this.getWPM = function(){
		return WPM;
	}

	/** Steps the current word to the next in the list
	*/
	this.step = function(){
		let success = true;
		// If we aren't at the end of the list;
		if (i < strList.length - 1){
			i++;
			updateWordParts();
		} else {
			success = false;
		}

		return success;
	}

	this.stepBackward = function(){
		let success = true;
		// If we aren't at the beginning of the list;
		if (i > 0){
			i--;
			updateWordParts();
		} else {
			success = false;
		}

		return success;
	}

	this.goToIndex = function(index){
		i = index;
		updateWordParts();
	}

	this.goToStart = function(){
		i = 0;
		updateWordParts();
	}

	this.getWordParts = function(){
		return wordParts;
	}

	this.getWord = function(){
		return word;
	}

	this.getWordIndex = function(){
		return i;
	}

	this.getWaitDuration = function(){
		return baseDuration * getPuncMod() * getLengthMod();
	}



	function updateWordParts(){
		// If there are words in the list
		if (strList.length){
			word = strList[i];
			const f = getFocusCharacterIndex(word.length);
			wordParts[0] = word.slice(0,f); // Before focus
			wordParts[1] = word.slice(f,f+1); // Focus
			wordParts[2] = word.slice(f+1);	// After Focus
		}
	}

	function getFocusCharacterIndex(length){
		// Found this experimentally
		return ~~(Math.sqrt(word.length*2) + ~~(word.length*0.1)) - 1;
	}

	function updateBaseDuration(){
		baseDuration = 60000/WPM; //(60 s/min) * (1000 ms/s) / (X words/minute) = (Y ms/word)
	}


	function needsPuncMod(){
		const lastChar = word[word.length - 1];
		// Testing showed that literall checks were the fastest/ most efficient
		// it just sucks that it isn't very expandable
		// In order of descending frequency
		return lastChar === "." ||
			   lastChar === "," ||
			   lastChar === "\"" ||
			   lastChar === ":" ||
			   lastChar === "?" ||
			   lastChar === "!";
	}

	function getPuncMod(){
		if (needsPuncMod()){
			return puncuationModifier;
		}
		return 1;
	}

	function getLengthMod(){
		// Found experimentally. 0.8 at 1 character, 1 at 5 and 1.5 at 16
		return 0.05*word.length + 0.75;
	}



	/* Based on provided options */
	// Words per minute
	if (options && (options.WPM || options.wpm)){
		this.setWPM(options.WPM || options.wpm)
	}
	// Text we are reading
	if (options && options.text){
		this.setText(options.text);
	}

	updateBaseDuration();
	/* ************************* */
}
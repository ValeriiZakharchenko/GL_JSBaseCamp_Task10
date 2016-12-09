'use strict'

/* saveGame - save current game to storage.
 * Returns values:
 * -1 if tablet not found!
 * Type of storage session/local sets in MODELs settings.
 */
const saveGame = function sgCon ( isAutoSave = false ) {
	// Take links to DOM elements in table
	let tablet = document.querySelector('.holderBoard');
	let moves = document.querySelector( 'div.holderScore span.steps' ).innerHTML;
	let timePass = set.timerGame.getMSeconds();

	// tablet === null - Dont find table
	if ( !tablet ) {
		alert ('Don\'t find the board whith cell!')
		return -1;
	}
	
	// Gathering order of cells by its names index
	let cell;
	let arrIndexes = [];
	for (let i = 0; i < tablet.children.length; i++ ) {
		for (let j = 0; j < tablet.children[i].children.length; j++) {
			cell = tablet.children[i].children[j];
			arrIndexes.push ( cell.getAttribute( 'name' ).slice(4) );
		}
	}
	
	// Save data to MODEL
	// Alert according result of writing.
	let res = saveData (arrIndexes, moves, timePass, isAutoSave);
	if ( res === -1 ) {
		alert ('localStorage not available!\nYou couldn\'t save the game');
	} else if ( res === 0 ) {
		alert ('Game saved successfully');
	}
};

/* Load data from storage.
 * Alert according returns of MODEL:
 * -1: storage not supports by this browser;
 * -2: game with such name absent;
 * obj: rebuilding VIEW;
 * else: unexpected response of MODEL.
 */
const loadGame = function lgCon ( isAutoSaved = false ) {
	// Loading Data from Model.
	let res = loadLastData ( isAutoSaved );
	
	// Handling returned value.
	if ( res === -1 ) {
		alert ('Storage is not supportes!');
		return false;
	}
	else if ( res === -2 ) {
		//alert ('There are not saved games whith such name! Try other name!');
		return false;
	}
	else if ( typeof res === 'object' ) {
		// Clear autosaved record after downloading data
		if ( isAutoSaved ) {
			removeSavedRecord (true);
		}
		// Rebuild board whith autosaved data.
		rebuild (res.cells, res.steps, res.time);
		return true;
	}
	else {
		console.log ('Unexpected case!')
		return false;
	}
}
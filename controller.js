'use strict'

/* saveGame - save current game to storage.
 * Returns values:
 * -1 if tablet not found!
 * Type of storage session/local sets in MODELs settings.
 */
var saveGame = function sgCon () {
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
	let res = saveData (arrIndexes, moves, timePass);
	if ( res === -1 ) {
		alert ('localStorage not available!\nYou couldn\'t save the game');
	} else if ( res === 0 ) {
		alert ('Game saved successfully');
	}
};

/* Load data from storage
 * Alert according returns of MODEL:
 * -1: storage not supports by this browser,
 * -2: game with such name absent.
 * obj: rebuilding VIEW
 * else: unexpected response of MODEL.
 */
var loadGame = function lgCon () {
	let res = loadLastData ();
	if ( res === -1 ) {
		alert ('Storage is not supportes!');
		return false;
	}
	else if ( res === -2 ) {
		alert ('There are not saved games whith such name! Try other name!');
		return false;
	}
	else if ( typeof res === 'object' ) {
		rebuild (res.cells, res.steps, res.time);
	}
	else {
		console.log ('Unexpected case!')
	}
}
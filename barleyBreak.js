'use strict'

/* Global parameters
 */
const set = {
	timerGame: null,
	movesDone: undefined,	// defines in build() and rebuild();
	sizeBoard: 4,
	colZero: 3,
	lineZero: 3,
	timerIntervalPointer: undefined
};

/* Create and return NODE.
 * Input parameter: nodeName, className, objSpec
 * nodeName - tag name
 * className - string or array of strin specify class/es of node.
 * objSpec - object. key will be attribute name, value of key will be value of attribute.
 * If objSpec is undefined - no attribute will be created.
 */
var makeNode = function mn(nodeName, className, objSpec) {
	let mainNode = document.createElement( nodeName );
	
	if (typeof className === 'string') {			// className - string
		mainNode.classList.add( className );
	}
	else if ( className instanceof Array ) {		// className - array
		for (let i = 0; i < className.length; i++ ) {
			mainNode.classList.add( className[i] );
		}
	}
	if ( arguments[2] != undefined ) {
		for ( let key in objSpec ) {
			mainNode.setAttribute ( key, objSpec[key] );
		}
	}
	return mainNode;
}

/* Create and return cell for barley-dreak's board whith text
 * Parameter 'cellNumber' - set value of inner text node and 
 * second part of class name: 'cell' + cellNumber.
 */
var cellCreator = function cc(cellNumber) {
	let cellNode = makeNode ('div', 'cell', {'name': `cell${cellNumber}`} );
	/*document.createElement ('div');
	cellNode.classList.add ('cell');
	cellNode.setAttribute ( 'name', `cell${cellNumber}`)*/
	cellNode.appendChild ( document.createTextNode ( cellNumber ) );
	return cellNode;
}

/* Create table: node div which hold others div elements and return it.
 * Parameter 'sizeTable**2' set number inner div nodes.
 * Last cell zero.
 */
var holderBoard = function hb( sizeTable = set.sizeBoard, arr = [] ) {
	// Create an array size sizeTable*sizeTable
	if ( !arr.length ) {
		for (let i = 1; i < sizeTable*sizeTable; i++) {
			arr.push(i);
		}
		arr.sort ( function (){ return Math.random () - 0.5 } );	// Blend the array
	}
	
	let boardNode = makeNode ('div', 'holderBoard');
	let rowNode, cellNode, zerNode;
	for ( let i = 0; i < sizeTable; i++ ) {
		rowNode = makeNode ( 'div', 'lineBoard', {'name':`line${i}`} );
		for (let j = 0; j < sizeTable; j++) {
			if (i === set.lineZero && j === set.colZero) {
				zerNode = makeNode ('div', ['cell', 'cellZero'], {'name': 'cell0'});
				rowNode.appendChild ( zerNode )
			}
			else {
				cellNode = cellCreator ( arr [i * sizeTable + j] );
				rowNode.appendChild ( cellNode );
			}
		}
		boardNode.appendChild ( rowNode );
	}
	return boardNode;
}

/* Create button 'Start game'
 */
var holderButtons = function hbt() {
	let scoreNode = makeNode ('div', 'holderButtons');
	let butNode = makeNode ('button', ['btn', 'btn-primary'], {'name':'btnNewGame', 'type':'button'} );
	butNode.innerHTML = 'New game'
	scoreNode.appendChild (butNode);
	
	let butNodeSave = makeNode ('button', ['btn', 'btn-primary'], {'name':'btnSaveGame', 'type':'button'} );
	butNodeSave.innerHTML = 'Save game'
	scoreNode.appendChild (butNodeSave);
	
	let butNodeLoad = makeNode ('button', ['btn', 'btn-primary'], {'name':'btnLoadGame', 'type':'button'} );
	butNodeLoad.innerHTML = 'Load saved game'
	scoreNode.appendChild (butNodeLoad);
	
	return scoreNode;
}

/* Create score holder
 */
var holderScore = function hs( momes = 0, time = '0 : 0 : 0' ) {
	let scoreNode = makeNode ('div', ['holderScore', 'text-center']);
	scoreNode.innerHTML =  `Steps: <span class='steps'>${momes}</span> time pass: <span class='time'>${time}</span>`;
	return scoreNode;
}

var build = function b ( orderCells = [], moves = 0, times = 0 ) {
	let mainNode = document.querySelector ('.holderMain');
	
	mainNode.appendChild ( holderButtons() );
	
	if (times){
		mainNode.appendChild ( holderScore( moves, set.timerGame.toString() ) );	
	} else {
		mainNode.appendChild ( holderScore() );
	}
	
	if ( orderCells.length === 0 ){
		mainNode.appendChild ( holderBoard() );
	} else {
		mainNode.appendChild ( holderBoard( Math.sqrt(orderCells.length), orderCells ) );
	}
	
	document.querySelector('.holderBoard').addEventListener('click', function() { moveCell(); });
	document.querySelector('[name=btnNewGame]').addEventListener('click',  function() { rebuild(); } );
	document.querySelector('[name=btnSaveGame]').addEventListener('click', function() { saveGame(); } );
	document.querySelector('[name=btnLoadGame]').addEventListener('click', function() { loadGame(); } );
	
	// Init the moves counter if game start
	// If galme loaded - couter started in rebuild();
	/*if ( moves === 0 ) {
		set.movesDone = movesCounter( moves );
	}*/
	set.movesDone = movesCounter( moves );
}

/* Rebuild table 
 * after click button 'NEW GAME' or 'LOAD GAME'
 */

var rebuild = function rb( orderCells = [], moves = 0, times = 0 ) {
	// If Load game whith other config ( size of table was changed).
	if ( orderCells.length > 0 ) {
		set.sizeBoard = Math.sqrt ( orderCells.length );
	}

	// times !== 0 when Load Saved game. 
	// Make timer whith passed time start rewriting time field with interval
	if ( times ) {
		set.timerGame = timerMaker (times);
		if (set.timerIntervalPointer !== undefined) {
			clearInterval (set.timerIntervalPointer);
		}
		set.timerIntervalPointer = setInterval( updateTimer, 1000 );
	} 
	// times === 0 when start New game.
	// Clear counter and rewriting time field with interval
	else {
		set.timerGame = null;
		if (set.timerIntervalPointer !== undefined) {
			clearInterval (set.timerIntervalPointer);
			set.timerIntervalPointer = undefined;
		}
	}

	// Create moves counter.
	// set.movesDone = movesCounter ( moves );
	
	// moves > 0 when load saved game
	// Searching for index of zero cell.
	if ( moves > 0 ) {
		set.colZero = orderCells.indexOf('0') % set.sizeBoard;
		set.lineZero = Math.floor ( orderCells.indexOf('0') / set.sizeBoard );
	}
	// moves === 0 when starts New game
	// zero cell in right bottom corner
	else {
		set.colZero = 3;
		set.lineZero = 3;
	}
	
	// Clear games table and build again in tag '.holderMain'
	let mainNode = document.querySelector ('.holderMain');
	while ( mainNode.firstChild ) {						// null
		mainNode.removeChild( mainNode.firstChild );
	}
	build ( orderCells, moves, times );
}

/* Check necessity of move and move cell.
 * Move cell if distance to ZeroCell === 0
 */
function moveCell () { 
	// Nodes variables initialization.
	let cellNode = event.target;
	let lineBoard = cellNode.parentElement;
	let table = lineBoard.parentElement;

	// Count clicked column in table
	let temp = cellNode;
	let colClick = 0;
	while ( ( temp = temp.previousSibling ) != null )
		colClick++;

	// Count clicked line in table
	temp = lineBoard;
	let lineClick = 0;
	while ( ( temp = temp.previousSibling ) != null )
		lineClick++;

	// Distance from clicked cell to zeroCell
	let moveLeft = colClick - set.colZero;
	let moveUp =   lineClick - set.lineZero;

	// Count distance from clicked cell to zero cell
	// Move horizontally
	if ( Math.abs (moveLeft) === 1 && Math.abs (moveUp) === 0 ) {
		if ( !set.timerGame ) {
			set.timerGame = timerMaker ();
			set.timerIntervalPointer = setInterval( updateTimer, 1000 );
		}
		updateMoves();
		
		let tmp = cellNode.cloneNode (true);
		lineBoard.replaceChild ( lineBoard.children[ set.colZero ].cloneNode (true), cellNode);
		lineBoard.replaceChild ( tmp.cloneNode (true), lineBoard.children[ set.colZero ] );
		
		set.colZero += moveLeft;
	}
	
	// Move vertically
	else if ( Math.abs (moveLeft) === 0 && Math.abs (moveUp) === 1 ) {
		if ( !set.timerGame ) {											// set.timerGame === null
			set.timerGame = timerMaker ();
			set.timerIntervalPointer = setInterval( updateTimer, 1000 );
		}
		updateMoves();
		
		let tmp = table.children[set.lineZero].children[set.colZero].cloneNode (true);
		table.children [set.lineZero].replaceChild ( cellNode.cloneNode (true), table.children[set.lineZero].children[set.colZero] );
		lineBoard.replaceChild ( tmp, cellNode );

		set.lineZero += moveUp;
	}
	
	// Check victory condition.
	checkWin();
}

/* Create and start timer object.
 * Start after first click on cell or loading saved game.
 * Parameter:
 * 'timeBegin' - set value already passed time in milliseconds
 * Methods:
 * toString() - return string passed time in format: 'hh:mm:ss'
 * getMSeconds() - return number of milliseconds after beginnig
 * Ussage:
 * > var timerGame = timerMaker ()
 * > timerGame.toString() 		//" 0 : 0 : 28 "
 * > timerGame.getMSeconds()	//47816
 */
function timerMaker ( timeBegin = 0 ) {
	var startTime = Date.now() - timeBegin;
	return {
		toString: function (){
			let timePassed = new Date ( Date.now() - startTime );
			let h = timePassed.getUTCHours();
			let m = timePassed.getUTCMinutes();
			let s = timePassed.getUTCSeconds();
			return ` ${h} : ${m} : ${s} `;
		},
		getMSeconds: function () {
			return (Date.now() - startTime);
		}
	}
}

/* Displaying time on page
 * Evokes by setInterval if game started.
 */
function updateTimer (){
	document.querySelector( 'div.holderScore span.time' ).innerHTML = set.timerGame.toString();
}

/* Counter moves
 * Parameter 'moves' - set begining value to count (after load game).
 */
function movesCounter ( moves = 0 ){
	return function (){ return ++moves; }
}

/* Displaying moves on page
 * Evokes by click on cell
 */
function updateMoves () {
	document.querySelector( 'div.holderScore span.steps' ).innerHTML = set.movesDone();
}

/* Check victory condition.
 * If won then write parameters to aside panel.
 */
function checkWin () {
	let tablet = document.querySelector('.holderBoard')
	let cell;
	// Check cell's order by his name's end. if the order not [1,2, ... 15, 0], then return -1
	for (let i = 0; i < set.sizeBoard; i++ ) {
		for (let j = 0; j < set.sizeBoard; j++) {
			cell = tablet.children[i].children[j];
			if ( parseInt(cell.getAttribute( 'name' ).slice(4)) !== (i*set.sizeBoard + j+1)%16 ) {
				return -1;
			}
		}
	}
	// Save game's time, stop timer
	let timeStoped = set.timerGame.toString();
	clearInterval ( set.timerIntervalPointer );
	document.querySelector('.holderBoard').removeEventListener('click', moveCell);
	
	// Ask name end append to right section '.sidebar'.
	let nameWiner;
	if ( nameWiner = prompt ('Enter you name!') ) {
		let side = document.querySelector ('.sidebar');
		while ( side.firstChild ) {						// until not null
			side.removeChild( side.firstChild );
		}
		side.innerHTML += `Your result:<br>${nameWiner} for time ${timeStoped} .`;
		//document.querySelector( '.sidebar' ).appendChild( document.createElement( 'p' ).appendChild( document.createTextNode (`Best results: ${nameWiner} for time ${timeStoped}.`) ) );
	}
}
// START BIULDING PAGE
document.addEventListener( "DOMContentLoaded", function() { build(); } );

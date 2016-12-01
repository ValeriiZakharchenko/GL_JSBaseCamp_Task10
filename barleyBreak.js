'use strict'

var set = {
	timePass: 0,
	movesDone: undefined,	// defined in build() and rebuild();
	sizeBoard: 4,
	colZero: 3,
	lineZero: 3,
	timerIntervalPointer: undefined
};
var toSave = {
	order: [],
	moves: 0,
	time: 0
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
var holderBoard = function hb( sizeTable ) {
	if ( sizeTable === undefined ) {		// if not set inner argument- property from global object set.sizeBoard
		sizeTable = set.sizeBoard
	}
	
	var arr = [];										// Create an array size sizeTable*sizeTable
	for (let i = 1; i < sizeTable*sizeTable; i++) {
		arr.push(i);
	}
	arr.sort ( function (){ return Math.random () - 0.5 } );	// Blend the array
	
	let boardNode = makeNode ('div', 'holderBoard');
	let rowNode, cellNode, zerNode;
	for ( let i = 0; i < sizeTable; i++ ) {
		rowNode = makeNode ( 'div', 'lineBoard', {'name':`line${i}`} );
		for (let j = 0; j < sizeTable; j++) {
			if (i === sizeTable-1 && j === sizeTable-1){
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
	let butNode = makeNode ('button', ['btn', 'btn-primary', 'btn-block'], {'name':'btnNewGame', 'type':'button'} );
	butNode.innerHTML = 'New game'
	scoreNode.appendChild (butNode);
	return scoreNode;
}

/* Create score holder
 */
var holderScore = function hs() {
	let scoreNode = makeNode ('div', ['holderScore', 'text-center']);
	scoreNode.innerHTML =  `Steps: <span class='steps'>0</span> time pass: <span class='time'>0 : 0 : 0</span>`;
	return scoreNode;
}

var build = function b(){
	let mainNode = document.querySelector ('.holderMain');
	mainNode.appendChild ( holderButtons() );
	mainNode.appendChild ( holderScore() );
	mainNode.appendChild ( holderBoard() );
	document.querySelector('.holderBoard').addEventListener('click', moveCell);
	document.querySelector('[name=btnNewGame]').addEventListener('click', rebuild);
	
	set.movesDone = movesCounter();												// init the counter moves
}

var rebuild = function rb() {
	set.timePass = 0;
	set.colZero = 3;
	set.lineZero = 3;
	set.movesDone = movesCounter();
	if (set.timerIntervalPointer !== undefined) {
		clearInterval (set.timerIntervalPointer);
		set.timerIntervalPointer = undefined;
	}
	
	let mainNode = document.querySelector ('.holderMain');
	while ( mainNode.firstChild ) {						// null
		mainNode.removeChild( mainNode.firstChild );
	}
	build();
}

function moveCell() {
	let cellNode = event.target;			// Nodes variables initialization.
	let lineBoard = cellNode.parentElement;
	let table = lineBoard.parentElement;

	let temp = cellNode;					// Count clicked column in table
	let colClick = 0;
	while ( ( temp = temp.previousSibling ) != null )
		colClick++;

	temp = lineBoard;						// Count clicked line in table
	let lineClick = 0;
	while ( ( temp = temp.previousSibling ) != null )
		lineClick++;

	let moveLeft = colClick - set.colZero;	// Distance from clicked cell to zeroCell
	let moveUp =   lineClick - set.lineZero;

	if ( cellNode.className !== 'cell' ) {
		return 0;
	}
	
	if ( Math.abs (moveLeft) === 1 && Math.abs (moveUp) === 0 ) {
		if ( !set.timePass ) {
			set.timePass = timerMaker ();
			set.timerIntervalPointer = setInterval( updateTimer, 1000 );
		}
		updateMoves();
		
		let tmp = cellNode.cloneNode (true);
		lineBoard.replaceChild ( lineBoard.children[ set.colZero ].cloneNode (true), cellNode);
		lineBoard.replaceChild ( tmp.cloneNode (true), lineBoard.children[ set.colZero ] );
		
		set.colZero += moveLeft;
	}
	
	else if ( Math.abs (moveLeft) === 0 && Math.abs (moveUp) === 1 ) {
		if ( !set.timePass ) {
			set.timePass = timerMaker ();
			set.timerIntervalPointer = setInterval( updateTimer, 1000 );
		}
		updateMoves();
		
		let tmp = table.children[set.lineZero].children[set.colZero].cloneNode (true);
		table.children [set.lineZero].replaceChild ( cellNode.cloneNode (true), table.children[set.lineZero].children[set.colZero] );
		lineBoard.replaceChild ( tmp, cellNode );

		set.lineZero += moveUp;
	}
	checkWin();
}

/* Timer 
 * create and start timer object:
 * > var timer = timerMaker ()
 *
 * > timer.toString() 	//" 0 : 0 : 28 "
 * > timer.getMSeconds()	//47816
 */
function timerMaker () {
	var startTime = Date.now();
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
function updateTimer (){
	document.querySelector( 'div.holderScore span.time' ).innerHTML = set.timePass.toString();
}

/* Counter moves
 */
function movesCounter (){
	var moves = 0;
	return function (){ return ++moves; }
}

function updateMoves () {
	document.querySelector( 'div.holderScore span.steps' ).innerHTML = set.movesDone();
}

function checkWin () {
	let tablet = document.querySelector('.holderBoard')
	let cell;
	for (let i = 0; i < set.sizeBoard; i++ ) {
		for (let j = 0; j < set.sizeBoard; j++) {
			cell = tablet.children[i].children[j];
			if ( parseInt(cell.getAttribute( 'name' ).slice(4)) !== (i*set.sizeBoard + j+1)%16 ) {
				return -1;
			}
		}
	}
	clearInterval ( set.timerIntervalPointer );
	let nameWiner;
	if ( nameWiner = prompt ('Enter you name!') ) {
		let side = document.querySelector ('.sidebar');
		while ( side.firstChild ) {						// until not null
			side.removeChild( side.firstChild );
		}
		side.innerHTML += `Best results:<br>${nameWiner} for time ${set.timePass.toString()}.`;
	}
}

document.addEventListener("DOMContentLoaded", build);
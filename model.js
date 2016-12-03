'use strict'

const separator = '~~';
const arrSeparator = '~'
const nameRecord = 'lastgame';
const typeStorage = 'localStorage';

/* Check work whith Storage supported or not.
 * Parameter 'type' - string. 
 * Value could be whether 'localStorage' or 'sessionStorage'.
 */
function storageAvailable(type) {
	try {
		var storage = window[type],
			x = '__test__';
		storage.setItem(x, x);
		storage.removeItem(x);
		return true;
	}
	catch(e) {
		return false;
	}
}

/* Parameter: 
* cellArr - array of cell's index,
* steps - value of made steps,
* time - value passed time
* Returns:
* -1: if storage not supported and appropriate alert
* 0: save successfully.
*/
var saveData = function sgMod ( cellArr, steps, time ) {
	if ( !storageAvailable ( typeStorage ) ) {		// Storage not available
		return -1;
	}
	window[typeStorage].setItem ( nameRecord, steps + separator + time + separator + cellArr.join (arrSeparator) );
	return 0;
};

/* Parameters:
 * cells - array of cells index
 * steps - done steps
 * time - passed time in millyseconds
 * Returns:
 * -1: record is absent
 * -2: storagfe not supported
 * object: otherwise
 */
var loadLastData = function llgMod ( record = nameRecord ) {
	if ( !storageAvailable ( typeStorage ) ) {
		return -1
	}

	if ( !window[typeStorage].getItem(record) ) {			// null shen key 'record' is absent
		return -2;
	}
	let parsed = window[typeStorage].getItem(record).split(separator);
	return ( {cells: parsed[2].split(arrSeparator),
			  steps: parsed[0],
			  time: parsed[1]
			 } )
};


//==================Not used yet===========================================

/* Remove record from storage.
 * Parameter:
 * record - name of saved game's parameter
 * Returns:
 * -1 Storage not suuported
 * -2 Absent record, nothing to delete
 * 0 Remove saved game successfully
 */
var removeSavedRecord = function rsrMod ( record = nameRecord ) {
	if ( !storageAvailable ( typeStorage ) ) {
		return -1
	}

	if ( !window[typeStorage].getItem (record) ) {			// NULL when key 'racord' in storage absent
		return -2;
	}
	window[typeStorage].removeItem (record);
};

/* Remove all saved data from Storage.
 * Returns:
 * -1 Storage not suuported
 * 0 Remove all saved data successfully
 */
var removeAllRecords = function rarMod () {
	if ( !storageAvailable ( typeStorage ) ) {
		return -1
	}
	window[typeStorage].clear();
};
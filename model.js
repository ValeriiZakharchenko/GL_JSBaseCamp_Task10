'use strict'

const separator = '~~';
const arrSeparator = '~'
//const nameRecord = 'lastGame';
const nameRecord = ['lastGame', 'autoSaveGame'];
const typeStorage = 'localStorage';

/* Check work whith Storage supported or not.
 * Parameter 'type' - string. 
 * Value could be whether 'localStorage' or 'sessionStorage'.
 */
const storageAvailable = function saMod (type) {
	try {
		const storage = window[type],
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
 * cellArr - array of cell's index;
 * steps - value of made steps;
 * time - value passed time;
 * isAutoSave - boolean value which define record is autosaved or not.
 * Returns:
 * -1: if storage not supported and appropriate alert;
 * 0: save successfully.
 */
const saveData = function sgMod ( cellArr, steps, time, isAutoSave = false ) {
	if ( !storageAvailable ( typeStorage ) ) {		// Storage not available
		return -1;
	}
	let name = isAutoSave ? nameRecord [1] : nameRecord[0];		// Set autosave name or not
	if (isAutoSave)	alert ('asdfasdf');
	window[typeStorage].setItem ( name, steps + separator + time + separator + cellArr.join (arrSeparator) );
	return 0;
};

/* Parameters:
 * isAutoSaved - boolean value which define record is autosaved or not.
 * Returns:
 * -1: record is absent;
 * -2: storagfe not supported;
 * object: otherwise.
 * Object parameters:
 * cells - array of cells index;
 * steps - done steps;
 * time - passed time in millyseconds.
 */
const loadLastData = function llgMod ( isAutoSaved = false ) {
	let record = isAutoSaved ? nameRecord [1] : nameRecord[0];	// Take autosaved record or not

	if ( !storageAvailable ( typeStorage ) ) {
		return -1;
	}

	if ( !window[typeStorage].getItem(record) ) {			// null - when key 'record' is absent
		return -2;
	}
	let parsed = window[typeStorage].getItem(record).split(separator);
	return ( {cells: parsed[2].split(arrSeparator),
			  steps: parsed[0],
			  time: parsed[1]
			 } );
};

/* Remove record from storage.
 * Parameter:
 * isAutoSaved - boolean value which define record is autosaved or not.
 * Returns:
 * -1 Storage not suuported;
 * -2 Absent record, nothing to delete;
 * 0 Remove saved game successfully.
 */
const removeSavedRecord = function rsrMod ( isAutoSaved = false ) {
	let record = isAutoSaved ? nameRecord [1] : nameRecord[0];	// Remove autosaved record or not

	if ( !storageAvailable ( typeStorage ) ) {
		return -1;
	}

	if ( !window[typeStorage].getItem (record) ) {			// NULL when key 'racord' in storage absent
		return -2;
	}
	window[typeStorage].removeItem (record);
};


//==================Not used yet===========================================

/* Remove all saved data from Storage.
 * Returns:
 * -1 Storage not suuported
 * 0 Remove all saved data successfully
 */
const removeAllRecords = function rarMod () {
	if ( !storageAvailable ( typeStorage ) ) {
		return -1;
	}
	window[typeStorage].clear();
};
/*** GLOBAL VARIABLES ***/

var _keyboard; // The current keyboard object.
var _activeId; // The current active key id.
var _configMode = MODE_WIRE; // The current config mode.

var _keys = []; // List of key elements on the keyboard.
var _rowLines = {}; // List of row line elements on the keyboard.
var _colLines = {}; // List of column line elements on the keyboard.
var _rowInds = []; // List of row indicators.
var _colInds = []; // List of column indicators.


/*** PAGE LOAD ***/

$(document).ready(function() {
});


/*** INITIAL SETUP ***/

// Upload button.
$('#tfb-upload').click(function() {
	// Get the file.
	readFile(function(json) {
		try {
			_keyboard = JSON.parse(json);

			// Reset and show the config screen.
			resetConfig();
			showScreen('config');

			// Show the wire config.
			setConfigMode(MODE_WIRE);

			// Draw the wires.
			drawWires();
		} catch (e) {
			console.error(e);
			showError('Bad configuration file.');
		}
	});
});

// Import button.
$('#kle-import').click(function() {
	// Get the contents of the textarea.
	var json = $('#kle').val();

	// Attempt to create the keyboard.
	try {
		_keyboard = fromKLE(json);

		// Reset and show the config screen.
		resetConfig();
		showScreen('config');

		// Show the wire config.
		setConfigMode(MODE_WIRE);

		// Draw the wires.
		drawWires();
	} catch (e) {
		console.error(e);
		showError('Invalid layout.');
	}
});


/*** CONFIG ***/

// Wire mode.
$('#config-wire').click(function() {
	setConfigMode(MODE_WIRE);
});

// Firmware mode.
$('#config-firmware').click(function() {
	setConfigMode(MODE_FIRMWARE);
});


/*
 * Reset the config.
 */
function resetConfig() {
	// Create the new keyboard UI.
	createKeyboardUI();
}

/*
 * Create a new keyboard UI.
 */
function createKeyboardUI() {
	// Clear the keyboard.
	$('#keyboard').empty();

	// Keep track of the size of the keyboard.
	var width = 0;
	var height = 0;

	// Add the keys.
	for (var i in _keyboard.keys) {
		var key = _keyboard.keys[i];

		// Create a new key.
		var uiKey = $('<div class="key"><div class="key-inner"></div><div class="key-pad"></div></div>');

		// Set the key's size.
		uiKey.css('width', key.width * UI_KEY_SIZE + 'rem');
		uiKey.css('height', key.height * UI_KEY_SIZE + 'rem');

		// Set the key's position.
		uiKey.css('left', key.x * UI_KEY_SIZE + 'rem');
		uiKey.css('top', key.y * UI_KEY_SIZE + 'rem');

		// Set the size of the keyboard.
		width = Math.max(width, key.x + key.width);
		height = Math.max(height, key.y + key.height);

		// Store which key this is.
		uiKey.data('id', i);

		// Register the key's click event.
		uiKey.click(function() {
			// Set the active key.
			setActiveKey($(this));
		});

		// Add the key to the keyboard.
		$('#keyboard').append(uiKey);
		_keys.push(uiKey);
	}

	// Add the row indicators.
	for (var i = 0; i < _keyboard.rows; i ++) {
		var indicator = $('<div class="keyboard-row-indicator">' + i + '</div>');
		$('#keyboard').append(indicator);
		_rowInds.push(indicator);
	}

	// Add the column indicators.
	for (var i = 0; i < _keyboard.cols; i ++) {
		var indicator = $('<div class="keyboard-col-indicator">' + i + '</div>');
		$('#keyboard').append(indicator);
		_colInds.push(indicator);
	}

	// Set the size of the keyboard.
	$('#keyboard').css('width', width * UI_KEY_SIZE + 'rem');
	$('#keyboard').css('height', height * UI_KEY_SIZE + 'rem');
}

/*
 * Set the config mode.
 *
 * @param mode The mode to set to.
 */
function setConfigMode(mode) {
	_configMode = mode;

	// Hide elements according to the mode.
	if (mode == MODE_WIRE) {
		$('.config-firmware').hide(); // Firmware config panel.

		// Show the pin config panel.
		$('.config-pin').show();

		// Draw wires.
		drawWires();

		// Set the pin config.
		showPinConfig();
	} else {
		$('.config-wire').hide(); // Wire config panel.
		$('.config-pin').hide(); // Pin config panel.
		hideWires(); // Wire display.
	}

	// If the active key has been set, reload the config.
	if (_activeId !== undefined) {
		reloadKeyConfig();
	}
}

/*
 * Gets the currently active key.
 *
 * @return The currently active key.
 */
function getActiveKey() {
	if (_activeId !== undefined) {
		return _keyboard.keys[_activeId];
	} else {
		return null;
	}
}

/*
 * Set the active key.
 *
 * @param key The UI key to set to be active.
 */
function setActiveKey(key) {
	// Set the active ID.
	_activeId = parseInt(key.data('id'));

	// Erase the active class from all keys.
	$('.key').removeClass('active');

	// Set the current key to be active.
	key.addClass('active');

	// Reload key config data.
	reloadKeyConfig();
}

/*
 * Reload the key config data.
 */
function reloadKeyConfig() {
	if (_configMode == MODE_WIRE) {
		// If the config mode is in wire mode, load wire config.
		loadWireConfig();
	} else {
		// Otherwise, load firmware config.
		loadFirmwareConfig();
	}
}


/*** WIRE CONFIG ***/

// Wire placement selector.
$('#config-wire-row, #config-wire-col').change(function() {
	// Get and clamp the value.
	var value = $(this).val();
	if (isNaN(value)) value = 0;
	value = Math.min(Math.max(value, 0), $(this).prop('max'));

	// Set the value to the clamped value.
	$(this).val(value);

	// Get the currently active key.
	var key = getActiveKey();

	// Set the key's position.
	if ($(this).is('#config-wire-row')) key.row = value;
	if ($(this).is('#config-wire-col')) key.col = value;

	// Redraw the wires.
	drawWires();
});

/*
 * Load the wire config.
 */
function loadWireConfig() {
	// Show the panel.
	$('.config-wire').show();

	// Set the maximum and minimum values for the row and column selectors.
	$('#config-wire-row').prop('max', _keyboard.rows - 1);
	$('#config-wire-col').prop('max', _keyboard.cols - 1);

	// Get the currently active key.
	var key = getActiveKey();

	// Set the row and column selector values.
	$('#config-wire-row').val(key.row);
	$('#config-wire-col').val(key.col);
}

/*
 * Gets the position of a key given its ID.
 *
 * @param id The id of the key.
 *
 * @return The x and y positions of the key.
 */
function getKeyPosition(id) {
	var key = _keys[id];
	var x = key.offset().left + key.width() / 2;
	var y = key.offset().top + key.height() / 2;
	return { x: x, y: y };
}

/*
 * Draws wires on the keyboard.
 */
function drawWires() {
	// Show key pads.
	$('.key-pad').show();

	// Hide all row and column indicators.
	$('.keyboard-row-indicator, .keyboard-col-indicator').hide();

	// Iterate through all the keys.
	for (var i in _keyboard.keys) {
		var key = _keyboard.keys[i];

		// Find the nearest previous keys along the row and column.
		var prevRow, prevCol;
		var prevRowI, prevColI;
		for (var j in _keyboard.keys) {
			var otherKey = _keyboard.keys[j];

			if (otherKey.col == key.col) {
				if (otherKey.row < key.row &&
					(prevRow === undefined || otherKey.row > prevRow.row)) {
					prevRow = otherKey;
					prevRowI = j;
				}
			}
			if (otherKey.row == key.row) {
				if (otherKey.col < key.col &&
					(prevCol === undefined || otherKey.col > prevCol.col)) {
					prevCol = otherKey;
					prevColI = j;
				}
			}
		}

		// Destroy the previous lines.
		if (_rowLines[i]) {
			_rowLines[i].remove();
			delete _rowLines[i];
		}
		if (_colLines[i]) {
			_colLines[i].remove();
			delete _colLines[i];
		}

		// Draw lines.
		var from = getKeyPosition(i);
		if (prevRow !== undefined) {
			var to = getKeyPosition(prevRowI);
			_rowLines[i] = $.line(from, to, {
				lineColor: '#2c3e50'
			});
		}
		if (prevCol !== undefined) {
			var to = getKeyPosition(prevColI);
			_colLines[i] = $.line(from, to, {
				lineColor: '#c0392b'
			});
		}

		// Unset prevRow and prevCol;
		prevRow = prevCol = undefined;

		// Move the row and column indicators.
		var rowInd = _rowInds[key.row];
		var colInd = _colInds[key.col];
		if (!rowInd.is(':visible') || from.x < rowInd.data('x')) {
			rowInd.css({
				'top': _keys[i].position().top,
				'line-height': _keys[i].height() + 'px'
			});
			rowInd.data('x', from.x);
		}
		if (!colInd.is(':visible') || from.y < rowInd.data('y')) {
			colInd.css({
				'left': _keys[i].position().left,
				'width': _keys[i].width()
			});
			colInd.data('y', from.y);
		}

		// Show the indicators.
		_rowInds[key.row].show();
		_colInds[key.col].show();
	}
}

/*
 * Hides the wire display.
 */
function hideWires() {
	// Hide key pads.
	$('.key-pad').hide();

	// Hide all row and column indicators.
	$('.keyboard-row-indicator, .keyboard-col-indicator').hide();

	// Destroy all the wires.
	for (var i in _rowLines) {
		_rowLines[i].remove();
		delete _rowLines[i];
	}
	for (var i in _colLines) {
		_colLines[i].remove();
		delete _colLines[i];
	}
}

/*
 * Shows the pin config.
 */
function showPinConfig() {
}


/*** FIRMWARE CONFIG ***/

/*
 * Load the firmware config.
 */
function loadFirmwareConfig() {
}

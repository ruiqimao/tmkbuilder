/*** CONFIG ***/

// Flip checkbox.
$('#config-flip').click(function() {
	// Set the keyboard flip.
	setFlip($(this).is(':checked'));
});

// Wire mode.
$('#config-wire').click(function() {
	setConfigMode(MODE_WIRE);
});

// Firmware mode.
$('#config-firmware').click(function() {
	setConfigMode(MODE_FIRMWARE);
});

// Compile mode.
$('#config-compile').click(function() {
	setConfigMode(MODE_COMPILE);
});

// Close config button.
$('.btn-unset-key').click(function() {
	setActiveKey(undefined);
});

// Keyboard input.
$(window).keydown(function(e) {
	if (_keyboardInput) {
		// Assign key based on keyboard event.
		assignKeyPress(e);
	}
});

// Remove keyboard input focus.
$(window).click(function() {
	_keyboardInput = false;
	$('.key.active').removeClass('active2');
});


/*
 * Reset the config.
 */
function resetConfig() {
	_keys = [];
	_colInds = [];
	_rowInds = [];

	// Create the new keyboard UI.
	createKeyboardUI();

	// Reload the config.
	setConfigMode(_configMode);

	// Set the active key.
	setActiveKey(_keys[_activeId]);
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
		var x = (_displayFlip ? _keyboard.width - key.width - key.x : key.x);
		uiKey.css('left', x * UI_KEY_SIZE + 'rem');
		uiKey.css('top', key.y * UI_KEY_SIZE + 'rem');

		// Set the size of the keyboard.
		width = Math.max(width, key.x + key.width);
		height = Math.max(height, key.y + key.height);

		// Store which key this is.
		uiKey.data('id', i);

		// Register the key's click event.
		uiKey.click(function(e) {
			// Set the active key.
			setActiveKey($(this));
			$(this).addClass('active2');

			// If the mode is firmware, enable keyboard input.
			if (_configMode == MODE_FIRMWARE) {
				e.stopPropagation();
				_keyboardInput = true;
			}
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
 * Sets the keyboard flip.
 *
 * @param flip Whether to flip the keyboard.
 */
function setFlip(flip) {
	_displayFlip = flip;
	resetConfig();
}

/*
 * Set the config mode.
 *
 * @param mode The mode to set to.
 */
function setConfigMode(mode) {
	_configMode = mode;

	if (mode == MODE_WIRE) {
		hideFirmwareMode();
		hideCompileMode();

		// Show the pin config panel.
		$('.config-pin').show();

		// Draw the wires.
		drawWires();
	}

	if (mode == MODE_FIRMWARE) {
		hideWireMode();
		hideCompileMode();

		// Show the layer config panel.
		$('.config-layer').show();

		// Show the macro editor.
		$('.config-macro').show();
		loadMacroConfig();

		// Draw all the keys.
		drawKeys();
	}

	if (mode == MODE_COMPILE) {
		hideWireMode();
		hideFirmwareMode();

		// Show the settings panel.
		$('.config-settings').show();

		// Show the compile panel.
		$('.config-compile').show();
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
 * @param key The UI key to set to be active. undefined if the key is to be unset.
 */
function setActiveKey(key) {
	// Erase the active class from all keys.
	$('.key').removeClass('active');
	$('.key').removeClass('active2');

	if (key !== undefined) {
		// Set the active ID.
		_activeId = parseInt(key.data('id'));

		// Set the current key to be active.
		key.addClass('active');
	} else {
		_activeId = undefined;
	}

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
	}

	if (_configMode == MODE_FIRMWARE) {
		// If the config mode is in firmware mode, load firmware config.
		loadFirmwareConfig();
	}

	if (_configMode == MODE_COMPILE) {
		// If the config mode is in compile mode, load compile config.
		loadCompileConfig();
	}
}

/*
 * Get the layout name in a file-friendly format.
 *
 * @return The sanitized layout name.
 */
function getLayoutFileName() {
	return _keyboard.name.replace(/[^a-z0-9]/gi, '').toLowerCase();
}

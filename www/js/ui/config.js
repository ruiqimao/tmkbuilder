/*** CONFIG ***/

// Layout name.
$('#config-name').change(function() {
	// Set the layout name.
	_keyboard.name = $(this).val();
});

// Download configuration.
$('#download-config').click(function() {
	// Stringify the keyboard.
	var json = JSON.stringify(_keyboard);

	// Download the file.
	var blob = new Blob([json], { type: 'text/plain;charset=utf-8' });
	saveAs(blob, getLayoutFileName() + '.json');
});

// Download source.
$('#download-source').click(function() {
	// Disable the button.
	$('#download-source').prop('disabled', true);

	// Get firmware.zip.
	JSZipUtils.getBinaryContent('/firmware/firmware.zip', function(err, data) {
		if (err) {
			showError('Unable to grab source .zip');
			$('#download-source').prop('disabled', false);
			return;
		}

		try {
			JSZip.loadAsync(data)
			.then(function(zip) {
				// Generate the source files.
				var keymapCommonH = generateKeymapCommonH();
				var keymapC = generateKeymapC();
				var ledC = generateLedC();
				var matrixC = generateMatrixC();

				// Insert the files into the zip file.
				zip.file('tmk_keyboard/keyboard/keymap_common.h', keymapCommonH);
				zip.file('tmk_keyboard/keyboard/keymap.c', keymapC);
				zip.file('tmk_keyboard/keyboard/led.c', ledC);
				zip.file('tmk_keyboard/keyboard/matrix.c', matrixC);

				// Download the file.
				zip.generateAsync({ type: 'blob' })
				.then(function(blob) {
					saveAs(blob, getLayoutFileName() + '.zip');

					// Re-enable the button.
					$('#download-source').prop('disabled', false);
				});
			})
		} catch (e) {
			console.error(e);
			showError('Unable to load source .zip');
			$('#download-source').prop('disabled', false);
			return;
		}
	});
});

// Download hex.
$('#download-hex').click(function() {
	// Disable the button.
	$('#download-hex').prop('disabled', true);

	// Generate the source files.
	var keymapCommonH = generateKeymapCommonH();
	var keymapC = generateKeymapC();
	var ledC = generateLedC();
	var matrixC = generateMatrixC();

	// Make the request to the server.
	$.ajax({
		url: API_SERVER + '/build',
		data: {
			keymapCommonH: keymapCommonH,
			keymapC: keymapC,
			ledC: ledC,
			matrixC: matrixC
		},
		method: 'POST',
		dataType: 'json',
		success: function(data) {
			// Re-enable the button.
			$('#download-hex').prop('disabled', false);

			// Check if there was an error.
			if (data.error) {
				showError(data.error);
				return;
			}

			// Downlaod the .hex file.
			var blob = new Blob([data.hex], { type: 'application/octet-stream' });
			saveAs(blob, getLayoutFileName() + '.hex');
		},
		error: function(error) {
			showError('Could not communicate with API server.');
			$('#download-hex').prop('disabled', false);
		}
	});
});

// Wire mode.
$('#config-wire').click(function() {
	setConfigMode(MODE_WIRE);
});

// Firmware mode.
$('#config-firmware').click(function() {
	setConfigMode(MODE_FIRMWARE);
});

// Close config button.
$('.btn-unset-key').click(function() {
	setActiveKey(undefined);
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

	if (mode == MODE_WIRE) {
		hideFirmwareMode();

		// Show the pin config panel.
		$('.config-pin').show();

		// Draw the wires.
		drawWires();
	} else {
		hideWireMode();

		// Show the layer config panel.
		$('.config-layer').show();

		// Show the macro editor.
		$('.config-macro').show();
		loadMacroConfig();

		// Draw all the keys.
		drawKeys();
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
	} else {
		// Otherwise, load firmware config.
		loadFirmwareConfig();
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

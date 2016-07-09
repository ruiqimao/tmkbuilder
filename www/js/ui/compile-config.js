// Layout name.
$('#config-name').change(function() {
	// Set the layout name.
	_keyboard.name = $(this).val();
});

// Diode direction.
$('#config-settings-diode').change(function() {
	// Set whether the diodes are reversed.
	if ($(this).val() == 0) {
		_keyboard.reversed = false;
	} else {
		_keyboard.reversed = true;
	}
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
	// Sanity check.
	checkLayout(function() {
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
					var configH = generateConfigH();
					var keymapCommonH = generateKeymapCommonH();
					var keymapC = generateKeymapC();
					var ledC = generateLedC();
					var matrixC = generateMatrixC();

					// Insert the files into the zip file.
					zip.file('tmk_keyboard/keyboard/config.h', configH);
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
});

// Download hex.
$('#download-hex').click(function() {
	// Sanity check.
	checkLayout(function() {
		// Disable the button.
		$('#download-hex').prop('disabled', true);

		// Generate the source files.
		var configH = generateConfigH();
		var keymapCommonH = generateKeymapCommonH();
		var keymapC = generateKeymapC();
		var ledC = generateLedC();
		var matrixC = generateMatrixC();

		// Make the request to the server.
		$.ajax({
			url: API_SERVER + '/build',
			data: {
				configH: configH,
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
});

// Cancel button.
$('#config-compile-warning-cancel').click(function() {
	// Hide the warning.
	$('#config-compile-warning').hide();
});

/*
 * Load the compile config.
 */
function loadCompileConfig() {
	// Set the layout name.
	$('#config-name').val(_keyboard.name);

	// Set the diode direction.
	if (_keyboard.reversed) {
		$('#config-settings-diode').val(1);
	} else {
		$('#config-settings-diode').val(0);
	}
}

/*
 * Hide all compile config items.
 */
function hideCompileMode() {
	$('.config-settings').hide();
	$('.config-compile').hide();
}

/*
 * Checks the layout to make sure commonly used keys are present.
 *
 * @param callback The function to call if everything is confirmed.
 */
function checkLayout(callback) {
	// Get the keys to check.
	var check = [];
	for (var i in CHECK_KEYS) {
		check.push(CHECK_KEYS[i]);
	}

	// Go through all keys and layers and check.
	for (var i in _keyboard.keys) {
		var key = _keyboard.keys[i];
		for (var layer = 0; layer < 8; layer ++) {
			var code = key.codes[layer];

			// Check if the key has been encountered yet.
			var index = check.indexOf(code);
			if (index != -1) {
				// If not, remove it from the list.
				check.splice(index, 1);
			}
		}
	}

	// If there are no problems, continue.
	if (check.length == 0) {
		callback();
		return;
	}

	// Clear the warning keys.
	$('#config-compile-warning-keys').empty();

	// Convert the keycodes into readable text and show them.
	for (var i in check) {
		var code = check[i];
		for (var j in SYMBOLS) {
			if (code == SYMBOLS[j]) code = j;
		}

		var element = $('<span></span>');
		element.text(code);
		$('#config-compile-warning-keys').append(element);
	}

	// Set the continue button action.
	$('#config-compile-warning-continue').click(function() {
		// Hide the warning.
		$('#config-compile-warning').hide();

		// Callback.
		this.callback();
	}.bind({ callback: callback }));

	// Show the warning.
	$('#config-compile-warning').show();
}

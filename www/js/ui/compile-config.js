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

// Download hex.
$('#download-hex').click(function() {
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

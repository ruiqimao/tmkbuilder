/*** FIRMWARE CONFIG ***/

// Layer selector.
$('#config-layer-value').change(function() {
	// Get and clamp the value.
	var value = $(this).val();
	if (isNaN(value)) value = 0;
	value = Math.min(Math.max(value, 0), 31);

	// Set the value to the clamped value.
	$(this).val(value);

	// Set the active layer.
	_activeLayer = value;

	// Redraw the keyboard.
	drawKeys();

	// If a key is selected, reload the config.
	if (_activeId !== undefined) loadFirmwareConfig();
});

// Key selector.
$('#config-key-value').change(function() {
	// Get the value.
	var value = $(this).val().trim().toUpperCase();

	// If the value starts with KC_, get rid of it.
	if (value.startsWith('KC_')) value = value.substr(3);

	// If the value is empty, assume TRNS.
	if (value.length == 0) {
		value = 'TRNS';
	} else {
		// Find the closest match.
		value = getKeyValue(value);
	}

	// Set the value.
	$(this).val(value);

	// Set the active key to the given value.
	_keyboard.keys[_activeId].codes[_activeLayer] = value;

	// Redraw the keys.
	drawKeys();

	// Reload the firmware config.
	loadFirmwareConfig();
});
$('#config-key-value').focus(function() {
	$(this).select();
});

/*
 * Load the firmware config.
 */
function loadFirmwareConfig() {
	// Show the panel.
	$('.config-key').show();

	// Set the key config value.
	$('#config-key-value').val(_keyboard.keys[_activeId].codes[_activeLayer]);

	// Focus on the key selector.
	$('#config-key-value').focus();

	// Load the Fn configurator.
	loadFnConfig();
}

/*
 * Hide all firmware config items.
 */
function hideFirmwareMode() {
	$('.config-key').hide();
	$('.config-layer').hide();
	$('.config-fn').hide();
	$('.key-inner').text('');
}

/*
 * Loads the Fn config panel.
 */
function loadFnConfig() {
	// Get all the Fn keys that are used.
	var used = [];
	for (var i in _keyboard.keys) {
		var key = _keyboard.keys[i];
		var codes = key.codes;
		for (var j in codes) {
			if (codes[j].startsWith('FN')) {
				var fnId = parseInt(codes[j].substr(2));
				if (used.indexOf(fnId == -1)) used.push(fnId);
			}
		}
	}

	// If at least one Fn key is used, show the panel.
	if (used.length > 0) {
		$('.config-fn').show();
	} else {
		$('.config-fn').hide();
		return;
	}
}

/*
 * Draws key values on every key.
 */
function drawKeys() {
	// Iterate through all the keys.
	for (var i in _keys) {
		var keyElement = _keys[i];
		var key = _keyboard.keys[i];

		// Get the value.
		var value = key.codes[_activeLayer];

		// Special values.
		for (var i in SYMBOLS) {
			if (SYMBOLS[i] == value) value = i;
		}

		// Set the key value.
		keyElement.find('.key-inner').text(value);
	}
}

/*
 * Gets the closest match to a valid key.
 *
 * @param value The raw value.
 *
 * @return The best guess for the keycode value.
 */
function getKeyValue(value) {
	// Special values.
	for (var i in SYMBOLS) {
		if (value == i) return SYMBOLS[i];
	}

	// Keep track of which key is closest and by how much.
	var closest = '';
	var closestDist = -1;

	// Iterate through all the valid keys.
	var distance;
	for (var i in KEYS) {
		// Set the key to the closest if it is closer.
		if ((distance = value.levenstein(KEYS[i])) < closestDist || closestDist == -1) {
			closest = KEYS[i];
			closestDist = distance;
		}
	}

	// Return the closest value.
	return closest;
}

/*
 * Loads a preset.
 *
 * @param id The preset id.
 */
function loadPreset(id) {
	// Get the preset json.
	$.get('/js/presets/' + id + '.json', function(data) {
		// Set the keyboard.
		_keyboard = data;

		// Initialize.
		init();

		// Set the default screen to firmware mode.
		setConfigMode(MODE_FIRMWARE);
	});
}

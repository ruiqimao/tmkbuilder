/*
 * Generates the row/column and keycode associations.
 *
 * @return An object representing the associations.
 */
function getKeymapAssociations() {
	// Create the object to store the associations in.
	var associations = {};

	// Iterate through all the keys.
	for (var i in _keyboard.keys) {
		var key = _keyboard.keys[i];

		// Add the association.
		associations[key.row + ',' + key.col] = key.codes;
	}

	// Return the associations.
	return associations;
}

/*
 * Generates the base keymap for the current keyboard.
 *
 * @return A string representing the base keymap.
 */
function generateBaseKeymap() {
	// Define and start two parts of the keymap.
	var keymap1 = '';
	var keymap2 = '';

	// Get the associations.
	var associations = getKeymapAssociations();

	// Get the width of each entry.
	var rowWidth = (_keyboard.rows - 1).toString().length;
	var colWidth = (_keyboard.cols - 1).toString().length;

	// Iterate through all rows and columns.
	for (var row = 0; row < _keyboard.rows; row ++) {
		// Add the padding in front.
		keymap1 += '    ';
		keymap2 += '    { ';

		for (var col = 0; col < _keyboard.cols; col ++) {
			if (associations[row + ',' + col] !== undefined) {
				// If the assocation exists, add the entry.
				var key = leftPad(row.toString(), rowWidth, '0') + leftPad(col.toString(), colWidth, '0');
				keymap1 += 'K' + key + ((row < _keyboard.rows - 1 || col < _keyboard.cols - 1) ? ', ' : '  ');
				keymap2 += 'KC_##K' + key + ', ';
			} else {
				// Otherwise, make it a nonexistent key.
				keymap1 += ' '.repeat(rowWidth + colWidth + 3);
				keymap2 += rightPad('KC_NO,', rowWidth + colWidth + 8, ' ');
			}
		}

		// Add the end of the line.
		keymap1 += '\\\n';
		keymap2 += '}, \\\n';
	}

	// Assemble and return the keymap.
	return '#define KEYMAP( \\\n' + keymap1 + ') { \\\n' + keymap2 + '}';
}

/*
 * Generates keymaps of the current keyboard.
 *
 * @return A list of strings representing the keymaps.
 */
function generateKeymaps() {
	// Define and start the keymaps.
	var keymaps = 'const uint8_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {\n';

	// Get the associations.
	var associations = getKeymapAssociations();

	// Get the longest keycode length.
	var codeWidth = Math.max.apply(null, _keyboard.keys
		.map(function(a) {
			return Math.max.apply(null, a.codes.map(function(b) {
				return b.length;
			}));
		}));

	// Iterate through all layers.
	for (var layer = 0; layer < 8; layer ++) {
		// Add a comment for the layer.
		keymaps += '    /* layer ' + layer + ' */\n';

		// Start the keymap.
		keymaps += '    KEYMAP(\n'

		// Iterate through all rows and columns.
		for (var row = 0; row < _keyboard.rows; row ++) {
			keymaps += '        ';
			for (var col = 0; col < _keyboard.cols; col ++) {
				var key = row + ',' + col;
				if (associations[key] !== undefined) {
					keymaps += leftPad(associations[key][layer], codeWidth, ' ') +
						((row < _keyboard.rows - 1 || col < _keyboard.cols - 1) ? ', ' : '  ');
				} else {
					keymaps += ' '.repeat(codeWidth + 2);
				}
			}
			if (row != _keyboard.rows - 1) keymaps += '\\\n';
		}

		// End the keymap.
		keymaps += '),\n'
	}

	// Finish and return the keymaps.
	keymaps += '};';
	return keymaps;
}

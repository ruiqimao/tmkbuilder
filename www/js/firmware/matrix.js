/*
 * Generate init_cols().
 *
 * @return The generated init_cols() function.
 */
function generateInitCols() {
	// Begin the function.
	var func = 'static void init_cols(void) {\n';

	// Associate the letters with numbers from column pin data.
	var associations = {};
	for (var i in _keyboard.colPins) {
		var letter = _keyboard.colPins[i][0];
		var number = _keyboard.colPins[i][1];

		if (associations[letter] !== undefined) {
			associations[letter].push(number);
		} else {
			associations[letter] = [number];
		}
	}

	// Write the associations.
	for (var letter in associations) {
		// Start the lines.
		var line1 = '    DDR' + letter + '  &= ~(';
		var line2 = '    PORT' + letter + ' |=  (';

		// Create the shifts.
		var shifts = associations[letter].map(function(a) {
			return '1 << ' + a;
		}).join(' | ');

		// Add the shifts and end the lines.
		line1 += shifts + ');\n';
		line2 += shifts + ');\n';

		// Add the lines to the function.
		func += line1;
		func += line2;
	}

	// End and return the function.
	func += '}';
	return func;
}

/*
 * Generate read_cols().
 *
 * @return The generated read_cols() function.
 */
function generateReadCols() {
	// Begin the function.
	var func = 'static matrix_row_t read_cols(void) {\n    return\n';

	// Get the maximum column index width.
	var colWidth = (_keyboard.cols - 1).toString().length;

	// Create a list of lines.
	var lines = [];

	// Iterate through the column pins.
	for (var i in _keyboard.colPins) {
		var letter = _keyboard.colPins[i][0];
		var number = _keyboard.colPins[i][1];

		// Create the line.
		var line = '        (PIN'
			+ letter
			+ ' & (1 << ' + number
			+ ') ? 0 : (1UL << ' + leftPad(i, colWidth, ' ') 
			+ '))';

		// Add the line to the list.
		lines.push(line);
	}

	// Join the lines and add them to the function.
	func += lines.join(' |\n') + ';\n';

	// End and return the function.
	func += '}';
	return func;
}

/*
 * Generate unselect_rows().
 *
 * @return The generated unselect_rows() function.
 */
function generateUnselectRows() {
	// Begin the function.
	var func = 'static void unselect_rows(void) {\n';

	// Associate the letters with numbers from row pin data.
	var associations = {};
	for (var i in _keyboard.rowPins) {
		var letter = _keyboard.rowPins[i][0];
		var number = _keyboard.rowPins[i][1];

		if (associations[letter] !== undefined) {
			associations[letter].push(number);
		} else {
			associations[letter] = [number];
		}
	}

	// Write the associations.
	for (var letter in associations) {
		// Start the lines.
		var line1 = '    DDR' + letter + '  &= ~0b';
		var line2 = '    PORT' + letter + ' &= ~0b';

		// Create the binary number.
		for(var i = 7; i >= 0; i --) {
			if (associations[letter].indexOf(i.toString()) != -1) {
				line1 += '1';
				line2 += '1';
			} else {
				line1 += '0';
				line2 += '0';
			}
		}

		// End the lines.
		line1 += ';\n';
		line2 += ';\n';

		// Add the lines to the function.
		func += line1;
		func += line2;
	}

	// End and return the function.
	func += '}';
	return func;
}

/*
 * Generate select_row().
 *
 * @return The generated select_row() function.
 */
function generateSelectRow() {
	// Begin the function.
	var func = 'static void select_rows(uint8_t row) {\n';
	func += '    switch (row) {\n';

	// Iterate through the rows.
	for (var i in _keyboard.rowPins) {
		var letter = _keyboard.rowPins[i][0];
		var number = _keyboard.rowPins[i][1];

		// Add the case.
		func += '        case ' + i + ':\n';

		// Add the lines.
		func += '            DDR' + letter + '  |=  (1 << ' + number + ');\n';
		func += '            PORT' + letter + ' &= ~(1 << ' + number + ');\n';

		// Add the break.
		func += '            break;\n';
	}

	// End and return the function.
	func += '    }\n};';
	return func;
}

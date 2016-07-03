/*
 * Generate macro code.
 *
 * @return The generated macro code.
 */
function generateMacroCode() {
	// Start the code.
	var code = 'enum macro_id {\n';
	for (var i in _keyboard.macros) {
		code += '    MACRO_' + i + ',\n'
	}
	code += '};\n\n';
	code += 'const macro_t *action_get_macro(keyrecord_t *record, uint8_t id, uint8_t opt) {\n';
	code += '    keyevent_t event = record->event;\n';
	code += '    switch (id) {\n';

	// Iterate through all the macros.
	for (var i in _keyboard.macros) {
		// Add the case.
		code += '        case MACRO_' + i + ':\n';
		code += '            return (event.pressed ?\n';
		code += '                    MACRO( ';

		// Iterate through the actions.
		for (var j in _keyboard.macros[i]) {
			var action = _keyboard.macros[i][j];

			// Add the action.
			code += action[0] + '(' + action[1] + '), ';
		}

		// Finish the action list.
		code += 'END ) :\n';
		code += '                    MACRO( END ));\n';
	}

	// Finish and return the code.
	code += '    }\n';
	code += '    return MACRO_NONE;\n';
	code += '}';
	return code;
}

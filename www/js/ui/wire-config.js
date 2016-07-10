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

// Pin row and col count.
$('#config-pin-rows-c, #config-pin-cols-c').change(function() {
	// Get and clamp the value.
	var value = $(this).val();
	if (isNaN(value)) value = 0;
	value = Math.min(Math.max(value, 0), $(this).prop('max'));

	// Set the value to the clamped value.
	$(this).val(value);

	// Get the row and column counts.
	var rows = parseInt($('#config-pin-rows-c').val());
	var cols = parseInt($('#config-pin-cols-c').val());
	_keyboard.rows = rows;
	_keyboard.cols = cols;

	// Resize the pin arrays.
	while (_keyboard.rowPins.length != rows) {
		if (_keyboard.rowPins.length > rows) {
			// Take one off the end if too long.
			_keyboard.rowPins.pop();
		} else {
			// Add one to the end if too short.
			_keyboard.rowPins.push(PINS[0]);
		}
	}
	while (_keyboard.colPins.length != cols) {
		if (_keyboard.colPins.length > cols) {
			// Take one off the end if too long.
			_keyboard.colPins.pop();
		} else {
			// Add one to the end if too short.
			_keyboard.colPins.push(PINS[0]);
		}
	}

	// Reassign rows and pins that are now out of bounds.
	for (var i in _keyboard.keys) {
		var key = _keyboard.keys[i];
		while (key.row >= rows) key.row --;
		while (key.col >= cols) key.col --;
	}

	// Reload everything.
	setPinConfig();
	resetConfig();
});

/*
 * Load the wire config.
 */
function loadWireConfig() {
	if (_activeId !== undefined) {
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
	} else {
		// Hide the panel.
		$('.config-wire').hide();
	}
}

/*
 * Hide all wire config items.
 */
function hideWireMode() {
	$('.config-wire').hide();
	$('.config-pin').hide();
	hideWires();
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
	var x = key.position().left + key.width() / 2;
	var y = key.position().top + key.height() / 2;
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
			_rowLines[i].css('pointer-events', 'none');
		}
		if (prevCol !== undefined) {
			var to = getKeyPosition(prevColI);
			_colLines[i] = $.line(from, to, {
				lineColor: '#c0392b'
			});
			_colLines[i].css('pointer-events', 'none');
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

		// Show the pin assignments on the indicators.
		_rowInds[key.row].html('(' + _keyboard.rowPins[key.row] + ') ' + key.row);
		_colInds[key.col].html('(' + _keyboard.colPins[key.col] + ')<br>' + key.col);

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
 * Sets the pin config.
 */
function setPinConfig() {

	function createPinSelector(type, pinNum) {
		// Create the elements.
		var element = $('<div class="input"></div>');
		var label = $('<label style="width:1rem; text-align:left;"></label>');
		var select = $('<select></select>');

		// If the type is an LED.
		if (type > 1) {
			// Add an unset value for LEDs.
			var option = $('<option></option>');
			option.text('No LED');
			option.val('');
			select.append(option);

			// Make the label wider.
			label.css('width', '5rem');
		}

		// Set the values.
		label.text(pinNum);
		for (var i in PINS) {
			var option = $('<option></option>');
			option.text(PINS[i]);
			option.val(PINS[i]);
			select.append(option);
		}

		// Pack the elements.
		element.append(label);
		element.append(select);

		// Change event.
		element.change(function() {
			// Change the pin.
			var value = this.select.val();
			switch (this.type) {
				case 0: {
					_keyboard.rowPins[this.pinNum] = value;
					break;
				}
				case 1: {
					_keyboard.colPins[this.pinNum] = value;
					break;
				}
				case 2: {
					_keyboard.ledPins[0] = value;
					break;
				}
				case 3: {
					_keyboard.ledPins[1] = value;
					break;
				}
				case 4: {
					_keyboard.ledPins[2] = value;
					break;
				}
			}

			if (this.type == 0 | this.type == 1) {
				// Redraw the wires.
				drawWires();
			}
		}.bind({ type: type, pinNum: pinNum, select: select }));

		return element;
	}

	// Empty the containers.
	$('#config-pin-rows').empty();
	$('#config-pin-cols').empty();
	$('#config-pin-leds').empty();

	// Add fields for each row and column.
	for (var row = 0; row < _keyboard.rows; row ++) {
		var selector = createPinSelector(0, row);
		selector.find('option[value=' + _keyboard.rowPins[row] + ']').prop('selected', true);
		$('#config-pin-rows').append(selector);
	}
	for (var col = 0; col < _keyboard.cols; col ++) {
		var selector = createPinSelector(1, col);
		selector.find('option[value=' + _keyboard.colPins[col] + ']').prop('selected', true);
		$('#config-pin-cols').append(selector);
	}

	// Add fields for LEDs.
	var selector = createPinSelector(2, 'Caps Lock');
	selector.find('option[value="' + _keyboard.ledPins[0] + '"]').prop('selected', true);
	$('#config-pin-leds').append(selector);
	selector = createPinSelector(3, 'Scroll Lock');
	selector.find('option[value="' + _keyboard.ledPins[1] + '"]').prop('selected', true);
	$('#config-pin-leds').append(selector);
	selector = createPinSelector(4, 'Num Lock');
	selector.find('option[value="' + _keyboard.ledPins[2] + '"]').prop('selected', true);
	$('#config-pin-leds').append(selector);

	// Set the row and column counts.
	$('#config-pin-rows-c').val(_keyboard.rows);
	$('#config-pin-cols-c').val(_keyboard.cols);
}

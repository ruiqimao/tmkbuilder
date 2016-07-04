/*
 * Generate led_set().
 *
 * @return The generated led_set() function.
 */
function generateLedSet() {
	// Begin the function.
	var func = 'void led_set(uint8_t usb_led) {\n';

	// Iterate through the LED pins.
	for (var i in _keyboard.ledPins) {
		if (_keyboard.ledPins[i].length == 0) continue;

		var letter = _keyboard.ledPins[i][0];
		var number = _keyboard.ledPins[i][1];

		// Get the USB_LED variable name.
		var usbLed = 'USB_LED_' + ['CAPS_LOCK', 'SCROLL_LOCK', 'NUM_LOCK'][i];

		// Create the if statement.
		func += '    if (usb_led & (1 << ' + usbLed + ')) {\n';

		// Output low.
		func += '        DDR' + letter + '  |=  (1 << ' + number + ');\n';
		func += '        PORT' + letter + ' &= ~(1 << ' + number + ');\n';

		// Create the else clause.
		func += '    } else {\n';

		// Hi-Z.
		func += '        DDR' + letter + '  &= ~(1 << ' + number + ');\n';
		func += '        PORT' + letter + ' &= ~(1 << ' + number + ');\n';

		// End the statement.
		func += '    }\n';
	}

	// End and return the function.
	func += '}';
	return func;
}

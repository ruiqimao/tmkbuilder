/*
 * Prototype for Key.
 */
function Key() {
	this.codes = new Array(8).fill('TRNS');

	this.width = 1;
	this.height = 1;

	this.x = 0;
	this.y = 0;

	this.row = 0;
	this.col = 0;
}

/*
 * Prototype for Keyboard.
 */
function Keyboard() {
	this.keys = [];
	this.macros = [[], [], [], [], [], [], [], []];

	this.rowPins = [];
	this.colPins = [];

	this.width = 0;
	this.height = 0;

	this.rows = 0;
	this.cols = 0;

	// Used to verify a valid keyboard layout.
	this.isKeyboard = 'thisIsAKeyboard';
}

/*
 * Reads a KLE layout and produces a keyboard.
 *
 * @param json KLE json.
 *
 * @return A keyboard object.
 */
function fromKLE(json) {
	var layout;

	// Attempt to parse the JSON.
	try {
		layout = JSON.parse(json);
	} catch (e) {
		// Correct the JSON.
		json = json.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ');
		layout = JSON.parse('[' + json + ']');
	}

	// Create a new keyboard.
	var keyboard = new Keyboard();
	keyboard.rows = layout.length;

	// Iterate through all the keys in the layout.
	var y = 0;
	for (var r in layout) {
		var row = layout[r];

		// Reset the x position and number of columns.
		var x = 0;
		var cols = 0;
		var col = 0;
		for (var c = 0; c < row.length; c ++) {
			// Set the key size.
			var width = 1;
			var height = 1;

			// Get the KLE key.
			var kleKey = row[c];

			// If the key is an object, set the properties.
			while (kleKey instanceof Object) {
				if (kleKey.x) x += kleKey.x;
				if (kleKey.y) y += kleKey.y;
				if (kleKey.w) width = kleKey.w;
				if (kleKey.h) height = kleKey.h;

				// Get the actual key.
				kleKey = row[++ c];
			}

			// Validate the input.
			if (isNaN(width) || width == 0 ||
				isNaN(height) || height == 0 ||
				isNaN(x) || isNaN(y)) {
				throw 'invalid layout';
			}

			// Create the new key and set its properties.
			var key = new Key();
			key.width = width;
			key.height = height;
			key.x = x;
			key.y = y;
			key.row = r;

			// Add the key to the keyboard.
			keyboard.keys.push(key);

			// Increment the x position.
			x += width;

			// Increment the number of columns.
			cols ++;

			// Increment the real column index.
			col ++;
		}

		// Set the number of keyboard columns and width.
		keyboard.cols = Math.max(keyboard.cols, cols);
		keyboard.width = Math.max(keyboard.width, x);

		// Increment the y position.
		y ++;
	}

	// Set the keyboard height.
	keyboard.height = y;

	// Assign estimated columns to the keys.
	var posTaken = [];
	for (var i in keyboard.keys) {
		var key = keyboard.keys[i];

		// Get the estimated column.
		var col = Math.floor((key.x + key.width / 2) / keyboard.width * keyboard.cols);

		// If the position is already taken, increment the column by one.
		while (posTaken.indexOf(key.row + ',' + col) != -1) col ++;

		// Set the column.
		key.col = col;

		// Save the position as taken.
		posTaken.push(key.row + ',' + key.col);

		// If the column number exceeds the number of columns possible, go back and shift everything back by 1.
		if (col >= keyboard.cols) {
			// Shift keys until we reach an unclaimed position.
			var prevIndex = i;
			var prev;
			while (posTaken.indexOf((prev = keyboard.keys[prevIndex --]).row + ',' + (prev.col - 1)) != -1) {
				prev.col --;
			}
			prev.col --;
		}
	}

	// Add all the pins to the keyboard.
	keyboard.rowPins = new Array(keyboard.rows).fill(0);
	keyboard.colPins = new Array(keyboard.cols).fill(0);

	// Verify the keyboard.
	if (keyboard.rows == 0 || keyboard.cols == 0) throw 'invalid layout';

	// Return the keyboard.
	return keyboard;
}

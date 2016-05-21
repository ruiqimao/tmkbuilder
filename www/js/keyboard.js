/*
 * Prototype for Key.
 */
function Key() {
	this.codes = new Array(32).fill(0);

	this.width = 1;
	this.height = 1;

	this.x = 0;
	this.y = 0;
}

/*
 * Prototype for Keyboard.
 */
function Keyboard() {
	this.keys = [];

	this.rows = 0;
	this.cols = 0;
}

/*
 * Reads a KLE layout and produces a keyboard.
 *
 * @param json KLE json.
 *
 * @return A keyboard object.
 */
function fromKLE(json) {
	// Correct the JSON.
	json = json.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ');

	// Parse the JSON.
	var layout = JSON.parse('[' + json + ']');

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
		for (var c = 0; c < row.length; c ++) {
			// Set the key size.
			var width = 1;
			var height = 1;

			// Get the KLE key.
			var kleKey = row[c];

			// If the key is an object, set the properties.
			if (kleKey instanceof Object) {
				if (kleKey.x) x += kleKey.x;
				if (kleKey.y) y += kleKey.y;
				if (kleKey.w) width = kleKey.w;
				if (kleKey.h) height = kleKey.h;

				// Get the actual key.
				kleKey = row[++ c];
			}

			// Create the new key and set its properties.
			var key = new Key();
			key.width = width;
			key.height = height;
			key.x = x;
			key.y = y;

			// Add the key to the keyboard.
			keyboard.keys.push(key);

			// Increment the x position.
			x += width;

			// Increment the number of columns.
			cols ++;
		}

		// Set the number of keyboard columns.
		keyboard.cols = Math.max(keyboard.cols, cols);

		// Increment the y position.
		y ++;
	}

	// Return the keyboard.
	return keyboard;
}

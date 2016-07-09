/*
 * Display an error.
 *
 * @param error The error.
 */
function showError(error) {
	$('#err').text(error);
	$('#msg').hide();
	$('#err').show();

	// Scroll up to the error.
	$("html, body").animate({ scrollTop: $('#err').offset().top - 40 }, 400);
}

/*
 * Display a message.
 *
 * @param message The message.
 */
function showMessage(message) {
	$('#msg').text(message);
	$('#err').hide();
	$('#msg').show();

	// Scroll up to the message.
	$("html, body").animate({ scrollTop: $('#msg').offset().top - 40 }, 400);
}

/*
 * Clears all messages.
 */
function clearMessages() {
	$('#err').hide();
	$('#msg').hide();
}


/*
 * Show a screen.
 *
 * @param screen Screen name.
 */
function showScreen(screen) {
	$('.screen').hide();
	$('#screen-' + screen).show();
}


/*
 * Read a text file.
 *
 * @param callback Function to call with the data.
 */
function readFile(callback) {
	// Create the file input object.
	var input = $(document.createElement('input'));
	input.attr('type', 'file');

	// Catch the change.
	input.change(function() {
		// Grab the file.
		var file = this.input[0].files[0];
		if (file) {
			// Create a new reader.
			var reader = new FileReader();
			reader.onload = function(evt) {
				var contents = evt.target.result;

				// Call the callback.
				this.callback(contents);
			}.bind(this);

			// Read the file.
			reader.readAsText(file, 'utf-8');
		}
	}.bind({ input: input, callback: callback }));

	// Click the object.
	input.trigger('click');
}

/*
 * Left pad.
 *
 * @param input The input string.
 * @param length The target length.
 * @param fill The character to fill the empty space with.
 *
 * @return The padded string.
 */
function leftPad(input, length, fill) {
	// Make sure fill is a single character.
	fill = fill[0];

	// Find the number of times the filler needs to be repeated.
	var times = length - input.length;

	// Validate.
	if (times < 0) return input;

	// Return.
	return fill.repeat(times) + input;
}

/*
 * Right pad.
 *
 * @param input The input string.
 * @param length The target length.
 * @param fill The character to fill the empty space with.
 *
 * @return The padded string.
 */
function rightPad(input, length, fill) {
	// Make sure fill is a single character.
	fill = fill[0];

	// Find the number of times the filler needs to be repeated.
	var times = length - input.length;

	// Validate.
	if (times < 0) return input;

	// Return.
	return input + fill.repeat(times);
}

/*
 * Levenstein edit distance.
 *
 * @param The string to compare against.
 *
 * @return The edit distance between the two strings.
 */
String.prototype.levenstein = function(string) {
	var a = this, b = string + "", m = [], i, j, min = Math.min;

	if (!(a && b)) return (b || a).length;

	for (i = 0; i <= b.length; m[i] = [i++]);
	for (j = 0; j <= a.length; m[0][j] = j++);

	for (i = 1; i <= b.length; i++) {
		for (j = 1; j <= a.length; j++) {
			m[i][j] = b.charAt(i - 1) == a.charAt(j - 1)
				? m[i - 1][j - 1]
				: m[i][j] = min(
					m[i - 1][j - 1] + 1,
					min(m[i][j - 1] + 1, m[i - 1 ][j] + 1))
		}
	}

	return m[b.length][a.length];
}
